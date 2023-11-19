import { Prisma } from '@prisma/client';

import { simpleProfileSelect } from '../profiles';

export const ProposalSelect = Prisma.validator<Prisma.ProposalSelect>()({
  id: true,
  createdAt: true,
  updatedAt: true,
  price: true,
  content: true,
  author: { select: { profile: { select: simpleProfileSelect } } },
});

const proposalModel = Prisma.validator<Prisma.ProfileDefaultArgs>()({
  select: ProposalSelect,
});

export type ProposalModel = Prisma.ProfileGetPayload<typeof proposalModel>;
