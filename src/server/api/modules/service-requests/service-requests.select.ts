import { Prisma } from '@prisma/client';

import { simpleProfileSelect } from '../profiles';

export const ServiceRequestSelect =
  Prisma.validator<Prisma.ServiceRequestSelect>()({
    id: true,
    slug: true,
    closeReason: true,
    comments: true,
    description: true,
    date: true,
    status: true,
    willWantProposal: true,
    numberOfProviderNeeded: true,
    nbOfHours: true,
    createdAt: true,
    estimatedPrice: true,
    startHour: true,
    phoneToContact: true,
    title: true,
    deletedAt: true,
    service: true,
    updatedAt: true,
    location: true,
    providersReserved: {
      select: { providerProfileId: true },
      where: { isActive: true, removedAt: null },
    },
    proposals: {
      where: { isArchived: false },
      select: { author: { select: { profileId: true } } },
    },
    author: { select: { profile: { select: simpleProfileSelect } } },
    photos: true,
    _count: {
      select: { comments: true, proposals: true, providersReserved: true },
    },
  });

const serviceRequestModel = Prisma.validator<Prisma.ProfileDefaultArgs>()({
  select: ServiceRequestSelect,
});

export type ServiceRequestModel = Prisma.ProfileGetPayload<
  typeof serviceRequestModel
>;
