import { FeedbackType } from '@prisma/client';
import { z } from 'zod';

export const createFeedBackFormSchema = z.object({
  type: z.nativeEnum(FeedbackType),
  content: z.string().min(1, 'Veuillez ajouter un commentaire.'),
  imageUrl: z.string().optional(),
});

export type CreateFeedBackFormInput = z.infer<typeof createFeedBackFormSchema>;
