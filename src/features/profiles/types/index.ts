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

export type GetProfileDetailsOutput =
  RouterOutputs['profiles']['getProfileDetails'];
export type GetProfileDetailsInput =
  RouterInputs['profiles']['getProfileDetails'];
export type GetProfileDetailsOptions =
  ReactQueryOptions['profiles']['getProfileDetails'];
