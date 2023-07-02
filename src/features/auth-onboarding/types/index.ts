import {
  type ReactQueryOptions,
  type RouterInputs,
  type RouterOutputs,
} from '@/utils/api';

export type UserRegisterOptions = ReactQueryOptions['auth']['userRegister'];
export type UserRegisterOutput = RouterOutputs['auth']['userRegister'];
export type UserRegisterInput = RouterInputs['auth']['userRegister'];
