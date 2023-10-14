import { USER_PROFILES_LIMIT_COUNT } from '@/constants';

import { toTitleCase } from '@/utils/strings';

import { prisma } from '@/server/db';
import { getDynamicDbSlug } from '@/server/utils/db-slug';

import {
  throwAuthorizationError,
  throwBadRequestError,
  throwNotFoundError,
} from '../../../utils/error-handling';
import { type GetByIdOrSlugQueryInput } from '../../validations/base.validations';
import { getUserById, updateUserById } from '../users';
import {
  createProfileByUserId,
  getAllProfileDetails,
  getProfileBySlug,
  getProfilesWithLocationByUserId,
} from './profiles.repository';
import { getProfileCreationMessage } from './profiles.utils';
import {
  type CreateProfileValidation,
  type GetProfilesByUserIdValidation,
} from './profiles.validations';

export const getProfilesByUserIdService = async (
  inputs: GetProfilesByUserIdValidation
) => {
  const { userId, name } = inputs;

  //Get all profiles of the current user
  const profiles = await getProfilesWithLocationByUserId(userId);

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

export const createProfileService = async (inputs: CreateProfileValidation) => {
  const { name, profileType, userId, location, phone, avatar } = inputs;

  const redirectUrl = profileType === 'PROVIDER' ? '/' : '/';

  const user = await getUserById(userId);

  if (!user) {
    throwNotFoundError('Utilisateur non trouvé !');
  }

  if (user?._count.profiles === USER_PROFILES_LIMIT_COUNT) {
    throwBadRequestError(
      `Vous ne pouvez utliser que maximum ${USER_PROFILES_LIMIT_COUNT} Profils pour votre compte !`
    );
  }

  const slug = await getDynamicDbSlug(name, getProfileBySlug);

  const [_, profile] = await prisma.$transaction([
    //Update the user infos by phone and location created
    updateUserById({
      id: userId,
      hasBeenOnboarded: true,
    }),
    //Create a profile for the given user
    createProfileByUserId({
      userId,
      phone,
      avatar,
      location: {
        connectOrCreate: {
          where: { name: location.name },
          create: {
            lat: location.lat,
            long: location.long,
            name: location.name,
            wikidata: location.wikidata,
          },
        },
      },
      name: toTitleCase(name),
      type: profileType,
      slug,
    }),
  ]);

  return {
    profile,
    redirectUrl,
    message: getProfileCreationMessage(name),
  };
};
