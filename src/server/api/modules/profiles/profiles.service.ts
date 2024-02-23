import { type Prisma, type ProfileType } from '@prisma/client';

import { prisma } from '@/server/db';

import {
  throwAuthorizationError,
  throwNotFoundError,
} from '../../../utils/error-handling';
import { type GetByIdOrSlugQueryInput } from '../../validations/base.validations';
import {
  getAllProfileDetails,
  getProfileStats,
  getProfilesByUserId,
} from './profiles.repository';
import { simpleProfileSelect } from './profiles.select';
import {
  type GetProfilesByUserIdValidation,
  type GetProfilesInfiniteInput,
  GetProfilesInput,
} from './profiles.validations';

export const getProfilesByUserIdService = async (
  inputs: GetProfilesByUserIdValidation
) => {
  const { userId, name } = inputs;

  //Get all profiles of the current user
  const profiles = await getProfilesByUserId(userId);

  if (!profiles) {
    throwNotFoundError('Utilisateur non trouvé !');
  }

  if (profiles.length === 0) throwAuthorizationError();

  return {
    profiles,
    message: `Ravie de vous avoir ${name}, Avec quel profil souhaitez-vous interagir ?`,
    success: true,
  };
};

export const getProfileDetailsService = async (
  inputs: GetByIdOrSlugQueryInput
) => {
  const profile = await getAllProfileDetails({ inputs });

  if (!profile) {
    throwNotFoundError('Utilisateur non trouvé !');
  }

  return {
    profile,
    success: true,
  };
};

export const getProfiles = async <TSelect extends Prisma.ProfileSelect>({
  input: { type, limit, page, query },
  select,
}: {
  input: GetProfilesInput;
  select?: TSelect;
}) => {
  const skip = page ? (page - 1) * limit : undefined;

  let OR: Prisma.ProfileWhereInput[] | undefined = undefined;
  const orderBy: Prisma.Enumerable<Prisma.ProfileOrderByWithRelationInput> = [];

  orderBy.push({ createdAt: 'asc' });

  if (query) {
    OR = [{ name: { contains: query } }, { bio: { contains: query } }];
  }

  return await prisma.profile.findMany({
    where: { type, OR },
    orderBy,
    select: { ...simpleProfileSelect, ...select },
    skip,
    take: limit,
  });
};

export const getProfilesInfinite = async ({
  limit,
  cursor,
  type,
}: GetProfilesInfiniteInput) => {
  const AND: Prisma.Enumerable<Prisma.ProfileWhereInput> = [];
  const orderBy: Prisma.Enumerable<Prisma.ProfileOrderByWithRelationInput> = [];

  if (type) {
    AND.push({ type });
  }

  orderBy.push({ createdAt: 'desc' });

  const profiles = await prisma.profile.findMany({
    take: limit + 1,
    cursor: cursor ? { id: cursor } : undefined,
    where: { AND },
    orderBy,
    select: {
      ...simpleProfileSelect,
    },
  });

  let nextCursor: string | undefined;
  if (profiles.length > limit) {
    const nextItem = profiles.pop();
    nextCursor = nextItem?.id;
  }

  return {
    nextCursor,
    profiles,
  };
};

export const getProfileStatsService = async (
  input: GetByIdOrSlugQueryInput
) => {
  const profile = await getProfileStats({ input });

  if (!profile) {
    throwNotFoundError('Utilisateur non trouvé !');
  }

  const customerServiceRequestCreatedCount =
    profile?.customerInfo?._count?.serviceRequests || 0;
  const customerServiceRequestProviderReservationCount =
    profile?.customerInfo?._count?.providersReserved || 0;

  const providerServiceRequestReservedCount =
    profile?.providerInfo?._count?.serviceRequestReservations || 0;
  const providerServiceRequestProposalCount =
    profile?.providerInfo?._count?.proposals || 0;
  const reviewCount = profile?._count?.receivedReviews || 0;

  return {
    profileId: profile.id,
    customerServiceRequestCreatedCount,
    customerServiceRequestProviderReservationCount,
    providerServiceRequestReservedCount,
    providerServiceRequestProposalCount,
    reviewCount,
  };
};
