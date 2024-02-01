import { Prisma } from '@prisma/client';

import { simpleProfileSelect } from '../profiles';

export const ProposalSelect = Prisma.validator<Prisma.ProposalSelect>()({
  id: true,
  createdAt: true,
  updatedAt: true,
  price: true,
  isArchived: true,
  content: true,
  serviceRequestId: true,
  author: {
    select: {
      profile: {
        select: {
          ...simpleProfileSelect,
          providerInfo: { select: { skills: true, profession: true } },
        },
      },
    },
  },
});

const proposalModel = Prisma.validator<Prisma.ProfileDefaultArgs>()({
  select: ProposalSelect,
});

export type ProposalModel = Prisma.ProfileGetPayload<typeof proposalModel>;
