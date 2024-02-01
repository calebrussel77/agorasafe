import { ProfileType } from '@prisma/client';

import {
  throwAuthorizationError,
  throwNotFoundError,
} from '../../../utils/error-handling';
import { type GetByIdOrSlugQueryInput } from '../../validations/base.validations';
import {
  getAllProfileDetails,
  getProfileStats,
  getProfiles,
  getProfilesByUserId,
} from './profiles.repository';
import { type GetProfilesByUserIdValidation } from './profiles.validations';

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

export const getProfilesService = async (profileType?: ProfileType) => {
  const profiles = await getProfiles(profileType);

  return {
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
  const providerServiceRequestProposalsCount =
    profile?.providerInfo?._count?.proposals || 0;
  const receivedReviewCount = profile?._count?.receivedReviews || 0;
  const createdReviewCount = profile?._count?.createdReviews || 0;

  return {
    profileId: profile.id,
    customerServiceRequestCreatedCount,
    customerServiceRequestProviderReservationCount,
    providerServiceRequestReservedCount,
    providerServiceRequestProposalsCount,
    createdReviewCount,
    receivedReviewCount,
  };
};
