import { phoneSchema } from '@/validations';
import { ProfileType } from '@prisma/client';
import { z } from 'zod';

export const authValidationSchema = z.object({
  phone: phoneSchema,
  profileType: z.nativeEnum(ProfileType),
  location: z.object({
    name: z.string(),
    lat: z.string(),
    long: z.string(),
    wikidata: z.string().optional(),
  }),
});

export type AuthValidation = z.infer<typeof authValidationSchema> & {
  userId: string;
};