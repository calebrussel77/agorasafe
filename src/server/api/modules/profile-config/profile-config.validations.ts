import { z } from 'zod';

export const getProfileConfigValidationSchema = z.object({
  profileId: z.string().trim(),
});

export type GetProfileConfigValidation = z.infer<
  typeof getProfileConfigValidationSchema
> & { userId: string };
