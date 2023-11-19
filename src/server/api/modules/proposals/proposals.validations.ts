import { ProposalSort } from '@/shared/enums';
import { z } from 'zod';

export type GetProposalsInput = z.infer<typeof getProposalsSchema>;
export const getProposalsSchema = z.object({
  limit: z.number().min(0).max(100).default(20),
  cursor: z.string().nullish(),
  sort: z.nativeEnum(ProposalSort).optional(),
});
