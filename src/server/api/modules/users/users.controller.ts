import { USER_PROFILES_LIMIT_COUNT } from '@/constants';

import { toTitleCase } from '@/utils/strings';

import { prisma } from '@/server/db';
import { getDynamicDbSlug } from '@/server/utils/db-slug';
import {
  throwBadRequestError,
  throwDbError,
  throwNotFoundError,
} from '@/server/utils/error-handling';

import { type Context } from '../../create-context';
import { createProfileByUserId, getProfileBySlug } from '../profiles';
import { acceptTOS, getUserById, updateUserById } from './users.repository';
import { getUserOnboardingWelcomeMessage } from './users.utils';
import { type CompleteUserOnboardingInput } from './users.validations';

export const acceptTOSHandler = async ({
  ctx,
}: {
  ctx: Omit<DeepNonNullable<Context>, 'profile'>;
}) => {
  try {
    const { id } = ctx.user;
    await acceptTOS({ id });
  } catch (e) {
    throw throwDbError(e);
  }
};

//TODO: Remove on the future all "*.service.ts" files. it's verbose.
export const completeUserOnboardingHandler = async ({
  input,
  ctx,
}: {
  input: CompleteUserOnboardingInput;
  ctx: Omit<DeepNonNullable<Context>, 'profile'>;
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

    const profileSlug = await getDynamicDbSlug(input.name, getProfileBySlug);

    let response;

    if (input.profileType === 'CUSTOMER') {
      const { name, profileType, location, phone, avatar, bio } = input;

      response = await prisma.$transaction([
        updateUserById({
          id: ctx.user.id,
          onboardingComplete: true,
        }),
        createProfileByUserId({
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
        }),
      ]);
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

      response = await prisma.$transaction([
        updateUserById({
          id: ctx.user.id,
          onboardingComplete: true,
        }),
        createProfileByUserId({
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
        }),
      ]);
    }

    const [_, profile] = response;

    return {
      profile,
      message: getUserOnboardingWelcomeMessage(profile.name),
    };
  } catch (error) {
    throw throwDbError(error);
  }
};
