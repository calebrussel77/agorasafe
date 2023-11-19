import { CommentSort } from '@/shared/enums';
import { z } from 'zod';

export type CommentConnectorInput = z.infer<typeof commentConnectorSchema>;
export const commentConnectorSchema = z.object({
  entityId: z.string(),
  entityType: z.enum(['service-request', 'comment', 'review', 'article']),
});

export type GetCommentsInput = z.infer<typeof getCommentsSchema>;
export const getCommentsSchema = commentConnectorSchema.extend({
  limit: z.number().min(0).max(100).default(20),
  cursor: z.string().nullish(),
  sort: z.nativeEnum(CommentSort).optional(),
});

export type UpsertCommentInput = z.infer<typeof upsertCommentSchema>;
export const upsertCommentSchema = commentConnectorSchema.extend({
  id: z.string().optional(),
  text: z.string(),
});
