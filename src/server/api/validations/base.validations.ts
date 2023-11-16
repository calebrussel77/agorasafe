import { Config } from 'isomorphic-dompurify';
import { z } from 'zod';

import { parseNumericString } from '@/utils/query-string-helpers';

import { sanitizeHTML } from '@/lib/html-helper';

const limit = z.preprocess(
  parseNumericString,
  z.number().min(1).max(150).default(20)
);
const page = z.preprocess(parseNumericString, z.number().min(0).default(1));

export const paginationSchema = z.object({
  limit,
  page,
});
export type PaginationInput = z.infer<typeof paginationSchema>;

export const getAllQuerySchema = paginationSchema.extend({
  query: z.string().optional(),
});

export type GetAllQueryInput = z.infer<typeof getAllQuerySchema>;

export const getByIdOrSlugQuerySchema = z
  .object({
    id: z.string().trim(),
    slug: z.string().trim(),
  })
  .partial()
  .refine(data => data.id || data.slug, "L'id ou le slug est requis");

export type GetByIdOrSlugQueryInput = z.infer<typeof getByIdOrSlugQuerySchema>;

export const getByIdQuerySchema = z.object({ id: z.number() });
export type GetByIdQueryInput = z.infer<typeof getByIdQuerySchema>;

export const getSanitizedStringSchema = (config?: Config) =>
  z.preprocess(val => {
    if (!val) return '';

    const str = String(val);
    const result = sanitizeHTML(str, config);
    return result;
  }, z.string());

export const nonEmptyHtmlString = getSanitizedStringSchema({
  ALLOWED_TAGS: ['div', 'strong', 'p', 'em', 'u', 's', 'a', 'br'],
}).refine(data => {
  return data && data.length > 0 && data !== '<p></p>';
}, 'Ce champs est requis.');
