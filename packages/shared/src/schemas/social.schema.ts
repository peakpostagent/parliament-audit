import { z } from 'zod';

export const SocialDraftsSchema = z.object({
  x: z.object({
    text: z.string().max(280),
    hashtags: z.array(z.string()).max(2),
  }),
  facebook: z.object({
    text: z.string().min(50).max(2000),
    hashtags: z.array(z.string()).max(3),
  }),
  instagram: z.object({
    caption: z.string().min(50).max(2200),
    firstCommentHashtags: z.array(z.string()).max(10),
  }),
  threads: z.object({
    text: z.string().max(500),
    hashtags: z.array(z.string()).max(2),
  }),
});
