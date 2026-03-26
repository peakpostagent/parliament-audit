import { Queue } from 'bullmq';
import { createRedisConnection } from './connection.js';

const connection = createRedisConnection();

/**
 * All queue definitions for Parliament Pulse pipeline.
 *
 * Event flow:
 *   vote.discovered → vote-parser → vote-normalizer → vote.ready
 *   vote.ready → content-generator → content.review
 *   content.review → (human review via dashboard)
 *   content.approved → publisher → social-scheduler
 *   vote.updated → correction-worker
 */

export const voteDiscoveredQueue = new Queue('vote.discovered', { connection });
export const voteReadyQueue = new Queue('vote.ready', { connection });
export const contentReviewQueue = new Queue('content.review', { connection });
export const contentApprovedQueue = new Queue('content.approved', { connection });
export const socialPostQueue = new Queue('social.post', { connection });
export const correctionQueue = new Queue('correction.needed', { connection });

// Job data types
export interface VoteDiscoveredJob {
  chamber: 'house' | 'senate';
  parliament: number;
  session: number;
  voteNumber: number;
  rawData: string; // Raw XML or HTML
}

export interface VoteReadyJob {
  voteId: string;
}

export interface ContentReviewJob {
  articleId: string;
  confidence: number;
}

export interface ContentApprovedJob {
  articleId: string;
}

export interface SocialPostJob {
  postId: string;
  platform: string;
}

export interface CorrectionJob {
  voteId: string;
  previousDataHash: string;
  newDataHash: string;
}
