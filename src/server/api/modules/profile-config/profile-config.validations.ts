import { z } from 'zod';

export const getProfileConfigValidationSchema = z.object({
  profile_id: z.string().trim(),
});

export type GetProfileConfigValidation = z.infer<
  typeof getProfileConfigValidationSchema
> & { user_id: string };
