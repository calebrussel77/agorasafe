import { ProposalSort } from '@/shared/enums';
import { type Prisma } from '@prisma/client';

import { prisma } from '@/server/db';

import { ProposalSelect } from './proposals.select';
import { type GetProposalsInput } from './proposals.validations';

export const getProposals = async ({
  limit,
  cursor,
  sort,
  where,
  select: _select,
}: GetProposalsInput & {
  select?: Prisma.ProposalSelect;
  where: Prisma.ProposalWhereInput | undefined;
}) => {
  const orderBy: Prisma.Enumerable<Prisma.ProposalOrderByWithRelationInput> =
    [];

  if (sort === ProposalSort.Newest) orderBy.push({ createdAt: 'desc' });
  else orderBy.push({ createdAt: 'asc' });

  return await prisma.proposal.findMany({
    take: limit,
    cursor: cursor ? { id: cursor } : undefined,
    where,
    orderBy,
    select: { ...ProposalSelect, ..._select },
  });
};

export const deleteProposal = ({ id }: { id: string }) => {
  return prisma.proposal.delete({ where: { id } });
};

export const getProposalCount = async <
  TSelect extends Prisma.ProposalCountAggregateInputType
>({
  select,
  where,
}: {
  select?: TSelect;
  where?: Prisma.ProposalWhereInput;
}) => {
  return await prisma.proposal.count({
    where,
    select,
  });
};

export function createProposal({
  data,
  select,
}: {
  data: Prisma.ProposalCreateInput;
  select?: Prisma.ProposalSelect;
}) {
  return prisma.proposal.create({
    data: {
      ...data,
    },
    select: { ...ProposalSelect, ...select },
  });
}

export function updateProposal({
  data,
  where,
  select,
}: {
  where: Prisma.ProposalWhereUniqueInput;
  data: Prisma.ProposalUpdateInput;
  select?: Prisma.ProposalSelect;
}) {
  return prisma.proposal.update({
    where,
    data: {
      ...data,
    },
    select: { ...ProposalSelect, ...select },
  });
}
