import { ProfileType } from '@prisma/client';
import { z } from 'zod';

export const createProfileValidationSchema = z.object({
  name: z.string().trim(),
  profileType: z.nativeEnum(ProfileType),
});

export const getProfilesByUserIdValidationSchema = z.object({
  userId: z.string().trim(),
  name: z.string().trim(),
});

export type CreateProfileValidation = z.infer<
  typeof createProfileValidationSchema
> & { userId: string };

export type GetProfilesByUserIdValidation = z.infer<
  typeof getProfilesByUserIdValidationSchema
>;
