import { api } from '@/utils/api';

import {
  type GetAllServiceCategoriesInput,
  type GetAllServiceCategoriesOptions,
  type GetAllservicesInput,
  type GetAllservicesOptions,
} from '../types';

export const useGetAllServices = (
  inputs: GetAllservicesInput = {},
  { ...restOptions }: GetAllservicesOptions = {}
) => {
  return api.services.getAllservices.useQuery(inputs, {
    ...restOptions,
  });
};

export const useGetAllServiceCategories = (
  inputs: GetAllServiceCategoriesInput = {},
  { ...restOptions }: GetAllServiceCategoriesOptions = {}
) => {
  return api.services.getAllServiceCategories.useQuery(inputs, {
    ...restOptions,
  });
};
