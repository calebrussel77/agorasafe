import { z } from 'zod';

import { parseNumericString } from '@/utils/query-string-helpers';

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

export const getByIdQuerySchema = z.object({ id: z.string() });
export type GetByIdQueryInput = z.infer<typeof getByIdQuerySchema>;
