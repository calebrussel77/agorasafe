import {
  type ReactQueryOptions,
  type RouterInputs,
  type RouterOutputs,
} from '@/utils/api';

export type GetProfileConfigOptions =
  ReactQueryOptions['profileConfig']['getProfileConfig'];
export type GetProfileConfigOutput =
  RouterOutputs['profileConfig']['getProfileConfig'];
export type GetProfileConfigInput =
  RouterInputs['profileConfig']['getProfileConfig'];
