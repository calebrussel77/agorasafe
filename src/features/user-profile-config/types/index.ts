import {
  type ReactQueryOptions,
  type RouterInputs,
  type RouterOutputs,
} from '@/utils/api';


export type GetUserProfileConfigOptions =
  ReactQueryOptions['userProfileConfig']['getUserProfileConfig'];
export type GetUserProfileConfigOutput = RouterOutputs['userProfileConfig']['getUserProfileConfig'];
export type GetUserProfileConfigInput = RouterInputs['userProfileConfig']['getUserProfileConfig'];
