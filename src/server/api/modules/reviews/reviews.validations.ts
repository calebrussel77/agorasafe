import { getSanitizedStringSchema } from '@/validations';
import { z } from 'zod';

export type GetUserReviewInput = z.infer<typeof getUserReviewSchema>;
export const getUserReviewSchema = z.object({
  serviceRequestId: z.string(),
});

export type GetReviewsInput = z.infer<typeof getReviewsSchema>;
export const getReviewsSchema = z.object({
  resourceIds: z.string().array(),
});

export type GetReviewsInfiniteInput = z.infer<typeof getReviewsInfiniteSchema>;
export const getReviewsInfiniteSchema = z.object({
  limit: z.number().min(1).max(100).default(50),
  cursor: z.string().optional(),
  serviceRequestId: z.string().optional(),
  profileSlug: z.string().optional(),
  authorId: z.string().optional(),
  include: z.array(z.enum(['serviceRequest'])).optional(),
});

export type UpsertReviewInput = z.infer<typeof upsertReviewSchema>;
export const upsertReviewSchema = z.object({
  id: z.string().optional(),
  serviceRequestId: z.string(),
  reviewedProfileId: z.string(),
  rating: z.number(),
  details: getSanitizedStringSchema().optional(),
});
