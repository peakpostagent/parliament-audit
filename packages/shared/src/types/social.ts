/**
 * Social media post types for Parliament Audit.
 */

export type SocialPlatform = 'x' | 'facebook' | 'instagram' | 'threads' | 'tiktok' | 'youtube';

export type SocialPostStatus = 'draft' | 'approved' | 'scheduled' | 'posted' | 'failed';

export interface SocialPost {
  id: string;
  articleId: string;
  voteId: string;
  platform: SocialPlatform;
  captionText: string;
  hashtags: string[];
  imageUrl: string | null;
  linkUrl: string | null;
  status: SocialPostStatus;
  scheduledFor: string | null;
  postedAt: string | null;
  platformPostId: string | null;
  createdAt: string;
}

export interface SocialDrafts {
  x: {
    text: string;
    hashtags: string[];
  };
  facebook: {
    text: string;
    hashtags: string[];
  };
  instagram: {
    caption: string;
    firstCommentHashtags: string[];
  };
  threads: {
    text: string;
    hashtags: string[];
  };
}

export interface VoteCardDesign {
  header: {
    badge: 'HOUSE VOTE' | 'SENATE VOTE';
    voteNumber: string;
    date: string;
  };
  title: string;
  result: 'PASSED' | 'FAILED' | 'TIED';
  resultColor: string;
  partyBars: Array<{
    partyShort: string;
    partyColor: string;
    yeas: number;
    nays: number;
    total: number;
  }>;
  totals: {
    yeas: number;
    nays: number;
  };
  footer: {
    brand: 'Parliament Audit';
    url: 'parliamentaudit.ca';
    tagline: 'Canada deserves to know.';
  };
}
