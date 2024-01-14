import { ProposalSort } from '@/shared/enums';
import { type Prisma } from '@prisma/client';

import { prisma } from '@/server/db';

import { ProposalSelect } from './proposals.select';
import { type GetProposalsInput } from './proposals.validations';

export const getProposals = async <TSelect extends Prisma.ProposalSelect>({
  limit,
  cursor,
  sort,
  where,
  select,
}: GetProposalsInput & {
  select: TSelect;
  where: Prisma.ProposalWhereInput | undefined;
}) => {
  const orderBy: Prisma.Enumerable<Prisma.ProposalOrderByWithRelationInput> =
    [];

  if (sort === ProposalSort.Newest) orderBy.push({ createdAt: 'desc' });
  else orderBy.push({ createdAt: 'asc' });

  return prisma.proposal.findMany({
    take: limit,
    cursor: cursor ? { id: cursor } : undefined,
    where,
    orderBy,
    select,
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
  return prisma.proposal.count({
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
  select = ProposalSelect,
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
    select,
  });
}
