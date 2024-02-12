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

export async function createProposal<
  TSelect extends Prisma.ProposalSelect
>(args: {
  data: Prisma.ProposalCreateInput;
  select?: TSelect;
}): Promise<Prisma.ProposalGetPayload<{ select: TSelect }>> {
  const { data, select } = args;
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  //@ts-ignore
  return prisma.proposal.create({
    data,
    select: select as Prisma.ProposalSelect,
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
