import { USER_PROFILES_LIMIT_COUNT } from '@/constants';
import slugify from 'slugify';

import { prisma } from '@/server/db';

import {
  throwBadRequestError,
  throwNotFoundError,
} from '../../../utils/error-handling';
import { getUserById, updateUserById } from '../users';
import {
  createProfileByUserId,
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

  const userProfiles = profiles.map(profile => ({
    id: profile.id,
    name: profile.name,
    type: profile.type,
    avatar: profile.avatar,
    slug: profile.slug,
    phone: profile.phone,
    deletedAt: profile.deletedAt,
    location: {
      name: profile?.location?.name,
      long: profile.location?.long,
      lat: profile.location?.lat,
    },
  }));

  return {
    profiles: userProfiles,
    message: `Ravie de vous avoir ${name}, Avec quel profil souhaitez-vous interagir ?`,
    success: true,
  };
};

export const createProfileService = async (inputs: CreateProfileValidation) => {
  const { name, profileType, userId, location, phone } = inputs;

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
      name: name,
      type: profileType,
      slug: slugify(name, { lower: true }), //TODO create the slug function to properly handle this
    }),
  ]);

  return {
    profile,
    redirectUrl,
    message: getProfileCreationMessage(name),
  };
};
