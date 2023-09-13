import { z } from 'zod';

export const phoneSchema = z
  .custom<`${number}px`>(val => {
    return /(\+237|237)(6|2)(2|3|[5-9])[0-9]{7}/gm.test(val as string);
  }, 'Veuillez renseigner un numéro de téléphone valide.')
  .or(z.string());

export const locationSchema = z.object({
  value: z.string(),
  label: z.string(),
  lat: z.coerce.string().default('-00'),
  long: z.coerce.string().default('-00'),
  wikidata: z.string().optional(),
});

export type PhoneInput = z.infer<typeof phoneSchema>;
export type LocationInput = z.infer<typeof locationSchema>;
