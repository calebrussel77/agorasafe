import { ProfileType } from '@prisma/client';
import { z } from 'zod';

export const createProfileValidationSchema = z.object({
  name: z.string().trim(),
  profile_type: z.nativeEnum(ProfileType),
});

export const getProfilesByUserIdValidationSchema = z.object({
  user_id: z.string().trim(),
  name: z.string().trim(),
});

export type CreateProfileValidation = z.infer<
  typeof createProfileValidationSchema
> & { user_id: string };

export type GetProfilesByUserIdValidation = z.infer<
  typeof getProfilesByUserIdValidationSchema
>;
