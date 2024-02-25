import { type Config } from 'isomorphic-dompurify';
import { z } from 'zod';

import { isArrayOfFile, isString } from '@/utils/type-guards';

import { sanitizeHTML } from '@/lib/html-helper';

export type PhoneInput = z.infer<typeof phoneSchema>;
export const phoneSchema = z
  .custom<`${number}px`>(val => {
    return /(\+237|237)(6|2)(2|3|[5-9])[0-9]{7}/gm.test(val as string);
  }, 'Veuillez renseigner un numéro de téléphone valide.')
  .or(z.string());

export type LocationInput = z.infer<typeof locationSchema>;
export const locationSchema = z.object(
  {
    placeId: z.string(),
    address: z.string(),
    lat: z.coerce.number().default(0),
    long: z.coerce.number().default(0),
    country: z.string().optional(),
    city: z.string().optional(),
  },
  { required_error: 'Ce champs est requis' }
);

export const imageSchema = z.unknown().refine(val => {
  return isArrayOfFile(val);
}, 'Doit être une liste de fichiers');

export const dateSchema = z.coerce.date();
export type DateInput = z.infer<typeof dateSchema>;

export type ProfilePreferencesInput = z.infer<typeof profilePreferencesSchema>;
export const profilePreferencesSchema = z
  .object({
    excludedProfileIds: z.array(z.number()),
    excludedServiceRequestIds: z.array(z.number()),
  })
  .partial();

export const getSanitizedStringSchema = (config?: Config) =>
  z.preprocess(val => {
    if (!val) return '';

    const str = String(val);
    const result = sanitizeHTML(str, config);

    if (isString(result) && result?.length === 0) return '';

    return result;
  }, z.string());

export const nonEmptyHtmlString = getSanitizedStringSchema({
  ALLOWED_TAGS: ['div', 'strong', 'p', 'em', 'u', 's', 'a', 'br'],
}).refine(data => {
  return data && data.length > 0 && data !== '<p></p>';
}, 'Ce champs est requis.');

export const rsOptionSchema = z.object(
  { label: z.string(), value: z.string() },
  {
    required_error: 'Ce champ est requis',
    invalid_type_error: 'Ce champ est requis',
  }
);
