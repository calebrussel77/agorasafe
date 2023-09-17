import { type ProfileType } from '@prisma/client';

import {
  type ReactQueryOptions,
  type RouterInputs,
  type RouterOutputs,
} from '@/utils/api';

export type GetUserProfilesOptions =
  ReactQueryOptions['profiles']['getUserProfiles'];

export type GetUserProfilesOutput =
  RouterOutputs['profiles']['getUserProfiles'];

export type GetUserProfilesInput = RouterInputs['profiles']['getUserProfiles'];

export type CreateProfileOptions =
  ReactQueryOptions['profiles']['createProfile'];
export type CreateProfileOutput = RouterOutputs['profiles']['createProfile'];
export type CreateProfileInput = RouterInputs['profiles']['createProfile'];
