import {
  throwAuthorizationError,
  throwNotFoundError,
} from '../../../utils/error-handling';
import { type GetByIdOrSlugQueryInput } from '../../validations/base.validations';
import {
  getAllProfileDetails,
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

  const customerJobPostedCount =
    profile?.customerInfo?._count?.serviceRequests || 0;
  const customerJobProvidersReservedCount =
    profile?.customerInfo?._count?.providersReserved || 0;
  const providerJobsReservedCount =
    profile?.providerInfo?._count?.serviceRequestReservations || 0;

  return {
    profile: {
      ...profile,
      customerJobPostedCount,
      customerJobProvidersReservedCount,
      providerJobsReservedCount,
    },
    success: true,
  };
};
