import { type Prisma } from '@prisma/client';

import { prisma } from '@/server/db';

import {
  GetProfileViewCountRangeInput,
  type GetServiceRequestsCountRangeInput,
} from './analytics.validations';

/** CUSTOMERS ANALYTICS */
export const getServiceRequestsCountRange = async ({
  input: { endDate, startDate, isAll, status = undefined },
  profileId,
}: {
  input: GetServiceRequestsCountRangeInput;
  profileId: string;
}) => {
  const where: Prisma.ServiceRequestWhereInput | undefined = {
    status,
  };

  if (isAll)
    return prisma.serviceRequest.findMany({
      select: { createdAt: true },
    });

  if (profileId) where['author'] = { profileId };

  return prisma.serviceRequest.findMany({
    where: {
      ...where,
      createdAt: {
        gte: startDate,
        lte: endDate,
      },
    },
    select: {
      createdAt: true,
    },
  });
};

export const getServiceRequestsConversionRate = async (profileId: string) => {
  const [totalRequests, convertedRequests] = await Promise.all([
    prisma.serviceRequest.count({
      where: {
        author: { profileId },
      },
    }),
    prisma.serviceRequestReservation.count({
      where: {
        serviceRequest: {
          author: { profileId },
        },
      },
    }),
  ]);
  const conversionRate = (convertedRequests / totalRequests) * 100;
  return { conversionRate, totalRequests };
};

export const getAverageRatingGivenByCustomer = async (profileId: string) => {
  const reviews = await prisma.review.findMany({
    where: {
      authorId: profileId,
    },
    select: {
      rating: true,
    },
  });

  if (reviews.length === 0) return 0; // Retourne 0 s'il n'y a pas d'avis

  const totalRating = reviews.reduce((acc, review) => acc + review.rating, 0);
  const averageRating = totalRating / reviews.length;

  return { averageRating, totalRating };
};
/** END CUSTOMERS ANALYTICS */

/** PROVIDERS ANALYTICS */
export const getProfileViewCountRange = async ({
  input: { endDate, startDate, isAll },
  profileId,
}: {
  input: GetProfileViewCountRangeInput;
  profileId: string;
}) => {
  const where: Prisma.ProfileViewWhereInput | undefined = {};

  if (isAll)
    return prisma.profileView.findMany({
      select: { createdAt: true },
    });

  if (profileId) where['profileId'] = profileId;

  return prisma.profileView.findMany({
    where: {
      ...where,
      createdAt: {
        gte: startDate,
        lte: endDate,
      },
    },
    select: {
      createdAt: true,
    },
  });
};

export const getProposalsByProviderCount = async (profileId: string) => {
  const count = await prisma.proposal.count({
    where: {
      author: { profileId },
      isArchived: false,
    },
  });
  return count;
};

export const getProposalsAcceptanceRate = async (profileId: string) => {
  const [totalProposals, acceptedProposals] = await Promise.all([
    prisma.proposal.count({
      where: {
        author: { profileId },
        isArchived: false,
      },
    }),
    prisma.serviceRequestReservation.count({
      where: {
        proposal: {
          author: { profileId },
          isArchived: false,
        },
      },
    }),
  ]);

  const acceptanceRate =
    totalProposals > 0 ? (acceptedProposals / totalProposals) * 100 : 0;
  return acceptanceRate;
};

export const getAverageRatingReceived = async (profileId: string) => {
  const reviews = await prisma.review.findMany({
    where: {
      reviewedProfileId: profileId,
    },
    select: {
      rating: true,
    },
  });

  const totalRating = reviews.reduce((acc, curr) => acc + curr.rating, 0);
  const averageRating = reviews.length > 0 ? totalRating / reviews.length : 0;

  return { averageRating, totalReviews: reviews?.length };
};
/** END PROVIDERS ANALYTICS */
