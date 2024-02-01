import { locationSchema, phoneSchema } from '@/validations';
import { ProfileType } from '@prisma/client';
import { z } from 'zod';

import { getSanitizedStringSchema } from '../../validations/base.validations';

// This file need to be exported on the client -
// We can't export it on the index file because trpc will throw error

export const onboardClientProfileSchema = z.object({
  avatar: z.string().trim().nullish(),
  name: z.string().min(3, 'Votre nom doit avoir au moins 03 caractères.'),
  phone: phoneSchema,
  bio: getSanitizedStringSchema({
    ALLOWED_TAGS: ['div', 'strong', 'p', 'em', 'u', 's', 'a', 'br'],
  })
    .nullish()
    .optional(), //TODO: add validation for max length => 180
  location: locationSchema,
});

export const onboardProviderProfileSchema = onboardClientProfileSchema.extend({
  skillsId: z
    .array(
      z.string({
        required_error: 'Vous devez rajouter vos compétences professionnelles.',
      })
    )
    .max(3, 'Vous devz rajouter au maximum 03 compétences professionnelles.'),
  isFaceToFace: z.boolean({ required_error: 'Mode de travail Requis' }),
  isRemote: z.boolean({ required_error: 'Mode de travail Requis' }),
  profession: z.string().min(3, 'Entrez une profession valide.'),
});

export const completeUserOnboardingSchema = z.discriminatedUnion(
  'profileType',
  [
    onboardClientProfileSchema.extend({
      profileType: z.literal(ProfileType.CUSTOMER),
    }),
    onboardProviderProfileSchema.extend({
      profileType: z.literal(ProfileType.PROVIDER),
    }),
  ]
);

export type CompleteUserOnboardingInput = z.infer<
  typeof completeUserOnboardingSchema
>;
