import {
  type ReactQueryOptions,
  type RouterInputs,
  type RouterOutputs,
} from '@/utils/api';

export type GetAllServiceCategoriesInput =
  RouterInputs['services']['getAllServiceCategories'];
export type GetAllservicesInput = RouterInputs['services']['getAllservices'];

export type GetAllServiceCategoriesOptions =
  ReactQueryOptions['services']['getAllServiceCategories'];
export type GetAllservicesOptions =
  ReactQueryOptions['services']['getAllservices'];

export type GetAllServiceCategoriesOutput =
  RouterOutputs['services']['getAllServiceCategories'];
export type GetAllservicesOutput = RouterOutputs['services']['getAllservices'];

export type ServiceItem = GetAllservicesOutput['services'][number];
export type ServiceCategoryItem =
  GetAllServiceCategoriesOutput['categories'][number];
