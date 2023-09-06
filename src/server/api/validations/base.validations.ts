import { z } from 'zod';

import { parseNumericString } from '@/utils/query-string-helpers';

export const getByIdSchema = z.object({ id: z.number() });
export type GetByIdInput = z.infer<typeof getByIdSchema>;

const limit = z.preprocess(
  parseNumericString,
  z.number().min(1).max(200).default(20)
);
const page = z.preprocess(parseNumericString, z.number().min(0).default(1));

export type PaginationInput = z.infer<typeof paginationSchema>;
export const paginationSchema = z.object({
  limit,
  page,
});

export const getAllQuerySchema = paginationSchema.extend({
  query: z.string().optional(),
});

export type GetAllSchema = z.infer<typeof getAllQuerySchema>;
