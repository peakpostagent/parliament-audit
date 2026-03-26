import {
  pgTable,
  uuid,
  text,
  integer,
  date,
  time,
  timestamp,
  boolean,
  real,
  jsonb,
  uniqueIndex,
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// ──────────────────────────────────────────────
// VOTES
// ──────────────────────────────────────────────

export const votes = pgTable('votes', {
  id: uuid('id').primaryKey().defaultRandom(),
  chamber: text('chamber').notNull(), // 'house' | 'senate'
  parliament: integer('parliament').notNull(),
  session: integer('session').notNull(),
  voteNumber: integer('vote_number').notNull(),
  voteDate: date('vote_date').notNull(),
  voteTime: time('vote_time'),

  // What was voted on
  subjectText: text('subject_text').notNull(),
  billNumber: text('bill_number'),
  billTitle: text('bill_title'),
  billStage: text('bill_stage'),
  voteType: text('vote_type').notNull(),
  motionText: text('motion_text'),
  sponsorName: text('sponsor_name'),
  sponsorParty: text('sponsor_party'),

  // Result
  result: text('result').notNull(), // 'passed' | 'failed' | 'tied'
  yeasTotal: integer('yeas_total').notNull(),
  naysTotal: integer('nays_total').notNull(),
  pairedTotal: integer('paired_total').default(0),
  abstentionsTotal: integer('abstentions_total').default(0),

  // Status
  recordStatus: text('record_status').notNull().default('preliminary'),

  // Source links
  sourceUrl: text('source_url').notNull(),
  billUrl: text('bill_url'),
  hansardUrl: text('hansard_url'),
  journalsUrl: text('journals_url'),
  legisinfoUrl: text('legisinfo_url'),

  // Metadata
  sittingNumber: integer('sitting_number'),
  rawXml: text('raw_xml'),
  ingestedAt: timestamp('ingested_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
}, (table) => [
  uniqueIndex('votes_chamber_parl_session_num').on(
    table.chamber,
    table.parliament,
    table.session,
    table.voteNumber
  ),
]);

// ──────────────────────────────────────────────
// VOTE PARTY RESULTS
// ──────────────────────────────────────────────

export const votePartyResults = pgTable('vote_party_results', {
  id: uuid('id').primaryKey().defaultRandom(),
  voteId: uuid('vote_id').notNull().references(() => votes.id, { onDelete: 'cascade' }),
  partyShort: text('party_short').notNull(),
  partyName: text('party_name').notNull(),
  yeas: integer('yeas').notNull().default(0),
  nays: integer('nays').notNull().default(0),
  paired: integer('paired').notNull().default(0),
  abstentions: integer('abstentions').notNull().default(0),
  absent: integer('absent').notNull().default(0),
  caucusSize: integer('caucus_size').notNull(),
}, (table) => [
  uniqueIndex('vote_party_results_vote_party').on(table.voteId, table.partyShort),
]);

// ──────────────────────────────────────────────
// VOTE MEMBER RESULTS
// ──────────────────────────────────────────────

export const voteMemberResults = pgTable('vote_member_results', {
  id: uuid('id').primaryKey().defaultRandom(),
  voteId: uuid('vote_id').notNull().references(() => votes.id, { onDelete: 'cascade' }),
  memberName: text('member_name').notNull(),
  memberId: text('member_id'),
  partyShort: text('party_short').notNull(),
  constituency: text('constituency'),
  province: text('province'),
  voteCast: text('vote_cast').notNull(), // 'yea' | 'nay' | 'paired' | 'abstention' | 'absent'
}, (table) => [
  uniqueIndex('vote_member_results_vote_member').on(table.voteId, table.memberId),
]);

// ──────────────────────────────────────────────
// ARTICLES
// ──────────────────────────────────────────────

export const articles = pgTable('articles', {
  id: uuid('id').primaryKey().defaultRandom(),
  voteId: uuid('vote_id').notNull().references(() => votes.id),
  slug: text('slug').notNull().unique(),

  // Content fields
  headline: text('headline').notNull(),
  subheadline: text('subheadline'),
  summary: text('summary').notNull(),
  whatHappened: text('what_happened').notNull(),
  partyBreakdown: text('party_breakdown').notNull(),
  whyItMatters: text('why_it_matters').notNull(),
  whatNext: text('what_next').notNull(),
  factBoxJson: jsonb('fact_box_json').notNull(),
  sourcesJson: jsonb('sources_json').notNull(),
  verificationText: text('verification_text').notNull(),

  // Status
  status: text('status').notNull().default('draft'),
  confidenceScore: real('confidence_score'),

  // AI metadata
  generationModel: text('generation_model'),
  generationPromptVersion: text('generation_prompt_version'),
  factCheckPassed: boolean('fact_check_passed').default(false),
  factCheckDetails: jsonb('fact_check_details'),

  // Review
  reviewedBy: text('reviewed_by'),
  reviewedAt: timestamp('reviewed_at', { withTimezone: true }),
  reviewNotes: text('review_notes'),

  // Publication
  publishedAt: timestamp('published_at', { withTimezone: true }),
  lastVerifiedAt: timestamp('last_verified_at', { withTimezone: true }),

  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
});

// ──────────────────────────────────────────────
// SOCIAL POSTS
// ──────────────────────────────────────────────

export const socialPosts = pgTable('social_posts', {
  id: uuid('id').primaryKey().defaultRandom(),
  articleId: uuid('article_id').notNull().references(() => articles.id),
  voteId: uuid('vote_id').notNull().references(() => votes.id),
  platform: text('platform').notNull(), // 'x' | 'facebook' | 'instagram' | 'threads'

  captionText: text('caption_text').notNull(),
  hashtags: text('hashtags').array(),
  imageUrl: text('image_url'),
  linkUrl: text('link_url'),

  status: text('status').notNull().default('draft'),
  scheduledFor: timestamp('scheduled_for', { withTimezone: true }),
  postedAt: timestamp('posted_at', { withTimezone: true }),
  platformPostId: text('platform_post_id'),

  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
});

// ──────────────────────────────────────────────
// CORRECTIONS
// ──────────────────────────────────────────────

export const corrections = pgTable('corrections', {
  id: uuid('id').primaryKey().defaultRandom(),
  voteId: uuid('vote_id').notNull().references(() => votes.id),
  articleId: uuid('article_id').references(() => articles.id),

  correctionType: text('correction_type').notNull(),
  description: text('description').notNull(),
  oldValues: jsonb('old_values'),
  newValues: jsonb('new_values'),

  correctedBy: text('corrected_by'),
  correctedAt: timestamp('corrected_at', { withTimezone: true }).notNull().defaultNow(),
  visibleToPublic: boolean('visible_to_public').default(true),
});

// ──────────────────────────────────────────────
// AUDIT LOG
// ──────────────────────────────────────────────

export const auditLog = pgTable('audit_log', {
  id: uuid('id').primaryKey().defaultRandom(),
  entityType: text('entity_type').notNull(),
  entityId: uuid('entity_id').notNull(),
  action: text('action').notNull(),
  actor: text('actor').notNull(),
  details: jsonb('details'),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
});

// ──────────────────────────────────────────────
// RELATIONS
// ──────────────────────────────────────────────

export const votesRelations = relations(votes, ({ many, one }) => ({
  partyResults: many(votePartyResults),
  memberResults: many(voteMemberResults),
  article: one(articles, { fields: [votes.id], references: [articles.voteId] }),
  corrections: many(corrections),
}));

export const votePartyResultsRelations = relations(votePartyResults, ({ one }) => ({
  vote: one(votes, { fields: [votePartyResults.voteId], references: [votes.id] }),
}));

export const voteMemberResultsRelations = relations(voteMemberResults, ({ one }) => ({
  vote: one(votes, { fields: [voteMemberResults.voteId], references: [votes.id] }),
}));

export const articlesRelations = relations(articles, ({ one, many }) => ({
  vote: one(votes, { fields: [articles.voteId], references: [votes.id] }),
  socialPosts: many(socialPosts),
  corrections: many(corrections),
}));

export const socialPostsRelations = relations(socialPosts, ({ one }) => ({
  article: one(articles, { fields: [socialPosts.articleId], references: [articles.id] }),
  vote: one(votes, { fields: [socialPosts.voteId], references: [votes.id] }),
}));

export const correctionsRelations = relations(corrections, ({ one }) => ({
  vote: one(votes, { fields: [corrections.voteId], references: [votes.id] }),
  article: one(articles, { fields: [corrections.articleId], references: [articles.id] }),
}));
