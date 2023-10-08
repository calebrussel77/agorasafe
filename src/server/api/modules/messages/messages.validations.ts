import { z } from 'zod';

import { getAllQuerySchema } from '../../validations/base.validations';

export const createDirectMessageSchema = z
  .object({
    profileId: z.string().trim(),
    content: z.string().trim().optional(),
    fileUrl: z.string().trim().optional(),
    conversationId: z.string().trim(),
  })
  .refine(
    data => data.content || data.fileUrl,
    'Le texte ou le fichier de votre message est requis.'
  );

export const updateDirectMessageSchema = z.object({
  directMessageId: z.string().trim(),
  content: z.string().trim(),
});

export const deleteDirectMessageSchema = updateDirectMessageSchema.pick({
  directMessageId: true,
});

export const getDirectMessagesSchema = getAllQuerySchema.partial().extend({
  orderBy: z.enum(['desc', 'asc']).default('desc').optional(),
  conversationId: z.string(),
  cursor: z.string().nullish(),
});

export type CreateDirectMessageInput = z.infer<
  typeof createDirectMessageSchema
>;

export type UpdateDirectMessageInput = z.infer<
  typeof updateDirectMessageSchema
>;

export type DeleteDirectMessageInput = z.infer<
  typeof deleteDirectMessageSchema
>;

export type GetDirectMessagesInput = z.infer<typeof getDirectMessagesSchema>;
