import { z } from 'zod';

export const contentSlugSchema = z.object({
  slug: z.preprocess(
    v => (Array.isArray(v) ? (v as string[]) : (v as string).split('/')),
    z.array(
      z.string().refine(value => /^[\w-]+$/.test(value), {
        message: 'Invalid slug segment',
      })
    )
  ),
});

export type ContentSlug = z.infer<typeof contentSlugSchema>;
