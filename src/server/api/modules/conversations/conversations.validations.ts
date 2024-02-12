import { z } from 'zod';

import { getAllQuerySchema } from '../../validations/base.validations';

export const getOrCreateConversationSchema = z.object({
  profileOneId: z.string().trim(),
  profileTwoId: z.string().trim(),
});

export type GetOrCreateConversationInput = z.infer<
  typeof getOrCreateConversationSchema
>;

export const getConversationsSchema = getAllQuerySchema.partial().extend({
  orderBy: z.enum(['desc', 'asc']).default('desc').optional(),
  profileId: z.string().optional(),
  cursor: z.string().nullish(),
});

export type GetConversationsInput = z.infer<typeof getConversationsSchema>;
