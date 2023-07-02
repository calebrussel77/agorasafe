import { ProfileType } from '@prisma/client';
import { z } from 'zod';

const phoneSchema = z
  .custom<`${number}px`>(val => {
    return /(\+237|237)(6|2)(2|3|[5-9])[0-9]{7}/gm.test(val as string);
  }, 'Veuillez renseigner un numéro de téléphone valide.')
  .or(z.string());

export const userRegisterSchema = z.object({
  phone: phoneSchema,
  profile_type: z.nativeEnum(ProfileType),
  location: z.object({
    name: z.string(),
    lat: z.string(),
    long: z.string(),
    wikidata: z.string().optional(),
  }),
});
