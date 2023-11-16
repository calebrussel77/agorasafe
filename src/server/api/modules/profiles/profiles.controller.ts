import { USER_PROFILES_LIMIT_COUNT } from '@/constants';

import { toTitleCase } from '@/utils/strings';

import { getDynamicDbSlug } from '@/server/utils/db-slug';

import {
  throwBadRequestError,
  throwDbError,
  throwNotFoundError,
} from '../../../utils/error-handling';
import { type Context } from '../../create-context';
import { type GetByIdOrSlugQueryInput } from '../../validations/base.validations';
import { getUserById } from '../users';
import { type CompleteUserOnboardingInput as CreateProfileInput } from '../users/users.validations';
import { createProfileByUserId, getProfileBySlug } from './profiles.repository';
import {
  getProfileDetailsService,
  getProfilesByUserIdService,
} from './profiles.service';
import { getProfileCreationMessage } from './profiles.utils';
import { type GetProfilesByUserIdValidation } from './profiles.validations';

export const getProfileDetailsController = async (
  inputs: GetByIdOrSlugQueryInput
) => {
  try {
    return await getProfileDetailsService(inputs);
  } catch (error) {
    throwDbError(error);
  }
};

export const getProfilesByUserIdController = async (
  inputs: GetProfilesByUserIdValidation
) => {
  try {
    return await getProfilesByUserIdService(inputs);
  } catch (error) {
    throwDbError(error);
  }
};

export const createProfileHandler = async ({
  input,
  ctx,
}: {
  input: CreateProfileInput;
  ctx: DeepNonNullable<Context>;
}) => {
  try {
    const user = await getUserById(ctx.user.id);

    if (!user) {
      throwNotFoundError('Utilisateur non trouvé !');
    }

    //SAFE GUARD about user profiles allowed
    if (user?._count.profiles === USER_PROFILES_LIMIT_COUNT) {
      throwBadRequestError(
        `Vous ne pouvez utliser que maximum ${USER_PROFILES_LIMIT_COUNT} Profils pour votre compte !`
      );
    }

    //SAFE GUARD about non duplicated profile type
    if (user?.profiles?.some(el => el.type === input.profileType)) {
      throwBadRequestError('Un profil de ce type existe déjà !');
    }

    const profileSlug = await getDynamicDbSlug(input.name, getProfileBySlug);

    let profile;

    if (input.profileType === 'CUSTOMER') {
      const { name, profileType, location, phone, avatar, bio } = input;

      profile = await createProfileByUserId({
        userId: ctx.user.id,
        phone,
        avatar,
        bio,
        location: {
          connectOrCreate: {
            where: { placeId: location.placeId },
            create: {
              lat: location.lat,
              long: location.long,
              address: location.address,
              placeId: location.placeId,
              country: location.country,
              city: location.city,
            },
          },
        },
        name: toTitleCase(name),
        type: profileType,
        slug: profileSlug,
      });
    } else {
      const {
        name,
        profileType,
        location,
        phone,
        avatar,
        bio,
        isFaceToFace,
        profession,
        isRemote,
        skillsId,
      } = input;

      profile = await createProfileByUserId({
        userId: ctx.user.id,
        phone,
        avatar,
        bio,
        providerInfo: {
          create: {
            isFaceToFace,
            isRemote,
            profession,
            skills: {
              connect: skillsId.map(skillId => ({ id: skillId })),
            },
          },
        },
        location: {
          connectOrCreate: {
            where: { placeId: location.placeId },
            create: {
              lat: location.lat,
              long: location.long,
              address: location.address,
              placeId: location.placeId,
              country: location.country,
              city: location.city,
            },
          },
        },
        name: toTitleCase(name),
        type: profileType,
        slug: profileSlug,
      });
    }

    return {
      profile,
      message: getProfileCreationMessage(profile.name),
    };
  } catch (error) {
    throw throwDbError(error);
  }
};
