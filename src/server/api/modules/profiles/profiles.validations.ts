import { phoneSchema } from '@/validations';
import { ProfileType } from '@prisma/client';
import { z } from 'zod';

export const createProfileValidationSchema = z.object({
  name: z.string().trim(),
  avatar: z.string().trim().optional(),
  phone: phoneSchema,
  profileType: z.nativeEnum(ProfileType),
  location: z.object({
    name: z.string(),
    lat: z.string(),
    long: z.string(),
    wikidata: z.string().optional(),
  }),
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
