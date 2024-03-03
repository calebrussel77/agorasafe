import { USER_PROFILES_LIMIT_COUNT } from '@/constants';
import { type ProfileType } from '@prisma/client';

import { toTitleCase } from '@/utils/strings';

import { prisma } from '@/server/db';
import { getDynamicDbSlug } from '@/server/utils/db-slug';

import {
  throwBadRequestError,
  throwDbError,
  throwNotFoundError,
} from '../../../utils/error-handling';
import { type Context } from '../../create-context';
import { type GetByIdOrSlugQueryInput } from '../../validations/base.validations';
import { getFormattedDatePeriod } from '../service-requests/service-requests.utils';
import { getUserById } from '../users';
import { type CompleteUserOnboardingInput as CreateProfileInput } from '../users/users.validations';
import {
  addProfileView,
  createProfileByUserId,
  getProfileByIdOrSlug,
  getProfileBySlug,
  getProfileServiceRequestReservations,
} from './profiles.repository';
import {
  getProfileDetailsService,
  getProfileStatsService,
  getProfiles,
  getProfilesByUserIdService,
} from './profiles.service';
import { getProfileCreationMessage } from './profiles.utils';
import {
  AddProfileViewInput,
  type GetProfileServiceRequestReservationsInput,
  type GetProfilesByUserIdValidation,
  type GetProfilesInput,
} from './profiles.validations';

export const getProfileDetailsController = async (
  inputs: GetByIdOrSlugQueryInput
) => {
  try {
    return await getProfileDetailsService(inputs);
  } catch (error) {
    throwDbError(error);
  }
};

export const getProfileStatsController = async (
  inputs: GetByIdOrSlugQueryInput
) => {
  try {
    return await getProfileStatsService(inputs);
  } catch (error) {
    throwDbError(error);
  }
};

export const getProfileServiceRequestReservationsHandler = async ({
  ctx,
  input,
}: {
  input: GetProfileServiceRequestReservationsInput;
  ctx: DeepNonNullable<Context>;
}) => {
  try {
    if (ctx.profile.type === 'CUSTOMER') {
      input.customerProfileId = ctx.profile.id;
    }

    if (ctx.profile.type === 'PROVIDER') {
      input.providerProfileId = ctx.profile.id;
    }

    const serviceRequestReservations =
      await getProfileServiceRequestReservations({
        input,
      });
    return serviceRequestReservations?.map(el => ({
      ...el,
      serviceRequest: {
        ...el?.serviceRequest,
        datePeriodFormattedText: getFormattedDatePeriod(
          el?.serviceRequest?.date,
          el?.serviceRequest?.startHour
        ),
      },
    }));
  } catch (e) {
    throwDbError(e);
  }
};

export const getProfilesHandler = async ({
  ctx,
  input,
}: {
  ctx: Context;
  input: GetProfilesInput;
}) => {
  try {
    return await getProfiles({ input });
  } catch (error) {
    throw throwDbError(error);
  }
};

export const addProfileViewHandler = async ({
  ctx,
  input,
}: {
  ctx: Context;
  input: AddProfileViewInput;
}) => {
  const viewerId = ctx?.profile ? ctx?.profile.id : input.viewerId;

  try {
    if (viewerId && input.profileId === viewerId) {
      throwBadRequestError('Vue invalide');
    }

    // Avant d'enregistrer une nouvelle vue
    const existingView = await prisma.profileView.findFirst({
      where: {
        profileId: input.profileId,
        viewerId,
        createdAt: {
          gte: new Date(new Date().getTime() - 24 * 60 * 60 * 1000), // Les dernières 24 heures
        },
      },
      select: { id: true },
    });

    if (!existingView) {
      return await addProfileView({ input });
    }
    return null;
  } catch (error) {
    throw throwDbError(error);
  }
};

export const getProfileByIdOrSlugHandler = async ({
  ctx,
  input,
}: {
  ctx: Context;
  input: GetByIdOrSlugQueryInput;
}) => {
  try {
    return await getProfileByIdOrSlug({ input });
  } catch (error) {
    throw throwDbError(error);
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
