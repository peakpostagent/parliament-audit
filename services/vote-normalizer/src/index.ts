/**
 * Vote Normalizer Service — Entry Point
 *
 * BullMQ worker that processes vote.discovered events.
 * Fetches detailed vote data, normalizes it, stores in database,
 * and emits vote.ready events for content generation.
 */

import { Worker } from 'bullmq';
import { db, schema } from '@parliament-pulse/db';
import {
  createRedisConnection,
  voteReadyQueue,
  type VoteDiscoveredJob,
} from '@parliament-pulse/queue';
import { normalizeHouseVote } from './normalize.js';

const connection = createRedisConnection();

const worker = new Worker<VoteDiscoveredJob>(
  'vote.discovered',
  async (job) => {
    const { chamber, parliament, session, voteNumber } = job.data;
    console.log(`[normalizer] Processing ${chamber} vote #${voteNumber}...`);

    if (chamber === 'house') {
      // Normalize using OpenParliament API (sourced from ourcommons.ca)
      const normalized = await normalizeHouseVote({ voteNumber });

      // Store in database
      const [voteRecord] = await db
        .insert(schema.votes)
        .values({
          chamber: normalized.chamber,
          parliament: normalized.parliament,
          session: normalized.session,
          voteNumber: normalized.voteNumber,
          voteDate: normalized.voteDate,
          voteTime: normalized.voteTime,
          subjectText: normalized.subjectText,
          billNumber: normalized.billNumber,
          billTitle: normalized.billTitle,
          billStage: normalized.billStage,
          voteType: normalized.voteType,
          motionText: normalized.motionText,
          sponsorName: normalized.sponsorName,
          sponsorParty: normalized.sponsorParty,
          result: normalized.result,
          yeasTotal: normalized.yeasTotal,
          naysTotal: normalized.naysTotal,
          pairedTotal: normalized.pairedTotal,
          abstentionsTotal: normalized.abstentionsTotal,
          recordStatus: normalized.recordStatus,
          sourceUrl: normalized.sourceUrl,
          billUrl: normalized.billUrl,
          hansardUrl: normalized.hansardUrl,
          journalsUrl: normalized.journalsUrl,
          legisinfoUrl: normalized.legisinfoUrl,
          sittingNumber: normalized.sittingNumber,
          rawXml: detailXml,
        })
        .onConflictDoUpdate({
          target: [schema.votes.chamber, schema.votes.parliament, schema.votes.session, schema.votes.voteNumber],
          set: {
            subjectText: normalized.subjectText,
            billTitle: normalized.billTitle,
            result: normalized.result,
            yeasTotal: normalized.yeasTotal,
            naysTotal: normalized.naysTotal,
            updatedAt: new Date(),
          },
        })
        .returning();

      // Store party results
      for (const party of normalized.partyResults) {
        await db
          .insert(schema.votePartyResults)
          .values({
            voteId: voteRecord.id,
            partyShort: party.partyShort,
            partyName: party.partyName,
            yeas: party.yeas,
            nays: party.nays,
            paired: party.paired,
            abstentions: party.abstentions,
            absent: party.absent,
            caucusSize: party.caucusSize,
          })
          .onConflictDoUpdate({
            target: [schema.votePartyResults.voteId, schema.votePartyResults.partyShort],
            set: {
              yeas: party.yeas,
              nays: party.nays,
              paired: party.paired,
              absent: party.absent,
              caucusSize: party.caucusSize,
            },
          });
      }

      // Store member results
      for (const member of normalized.memberResults) {
        await db
          .insert(schema.voteMemberResults)
          .values({
            voteId: voteRecord.id,
            memberName: member.memberName,
            memberId: member.memberId,
            partyShort: member.partyShort,
            constituency: member.constituency,
            province: member.province,
            voteCast: member.voteCast,
          })
          .onConflictDoNothing(); // Skip if already exists
      }

      // Audit log
      await db.insert(schema.auditLog).values({
        entityType: 'vote',
        entityId: voteRecord.id,
        action: 'created',
        actor: 'system:normalizer',
        details: {
          voteType: normalized.voteType,
          result: normalized.result,
          yeas: normalized.yeasTotal,
          nays: normalized.naysTotal,
        },
      });

      // Emit vote.ready for content generation
      await voteReadyQueue.add(
        `content-${voteRecord.id}`,
        { voteId: voteRecord.id },
        {
          jobId: `content-${voteRecord.id}`,
          attempts: 3,
          backoff: { type: 'exponential', delay: 10000 },
        }
      );

      console.log(`[normalizer] Vote #${voteNumber} normalized and stored as ${voteRecord.id}`);
    } else {
      // Senate handling — TODO in Phase 2
      console.log(`[normalizer] Senate vote processing not yet implemented`);
    }
  },
  {
    connection,
    concurrency: 5,
  }
);

worker.on('completed', (job) => {
  console.log(`[normalizer] Job ${job.id} completed`);
});

worker.on('failed', (job, err) => {
  console.error(`[normalizer] Job ${job?.id} failed:`, err.message);
});

console.log('════════════════════════════════════════════');
console.log('  Parliament Pulse — Vote Normalizer');
console.log('════════════════════════════════════════════');
console.log('[normalizer] Worker started, waiting for jobs...');
