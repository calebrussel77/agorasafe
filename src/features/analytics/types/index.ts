import { type RouterInputs, type RouterOutputs } from '@/utils/api';

export type GetDaysInput = RouterInputs['track']['getDays'];
export type GetDaysOutput = RouterOutputs['track']['getDays'];

export type GetServiceRequestsCountRangeOutput =
  RouterOutputs['analytics']['getServiceRequestsCountRange'];
