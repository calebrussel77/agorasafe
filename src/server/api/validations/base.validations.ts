import { z } from 'zod';

import { parseNumericString } from '@/utils/query-string-helpers';

const limit = z.preprocess(
  parseNumericString,
  z.number().min(1).max(200).default(20)
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

export const getByIdQuerySchema = z.object({ id: z.number() });
export type GetByIdQueryInput = z.infer<typeof getByIdQuerySchema>;
