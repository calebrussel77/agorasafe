import { z } from 'zod';

export const getProfilesByUserIdValidationSchema = z.object({
  userId: z.string().trim(),
  name: z.string().trim(),
});

export type GetProfilesByUserIdValidation = z.infer<
  typeof getProfilesByUserIdValidationSchema
>;
