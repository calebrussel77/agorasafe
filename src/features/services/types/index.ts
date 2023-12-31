import {
  type ReactQueryOptions,
  type RouterInputs,
  type RouterOutputs,
} from '@/utils/api';

export type GetAllServiceCategoriesInput =
  RouterInputs['services']['getAllServiceCategories'];
export type GetAllservicesInput = RouterInputs['services']['getAllservices'];

export type GetServiceRequestInput =
  RouterInputs['services']['getServiceRequest'];
export type GetServiceRequestOptions =
  ReactQueryOptions['services']['getServiceRequest'];
export type GetServiceRequestOutput =
  RouterOutputs['services']['getServiceRequest'];

export type GetAllservicesOptions =
  ReactQueryOptions['services']['getAllservices'];
export type GetAllServiceCategoriesOptions =
  ReactQueryOptions['services']['getAllServiceCategories'];

export type GetServiceRequestCommentsOptions =
  ReactQueryOptions['services']['getServiceRequestComments'];
export type GetServiceRequestCommentsOutput =
  RouterOutputs['services']['getServiceRequestComments'];
export type GetServiceRequestCommentsInput =
  RouterInputs['services']['getServiceRequestComments'];

export type PublishServiceRequestOptions =
  ReactQueryOptions['services']['publishServiceRequest'];
export type PublishServiceRequestInputs =
  RouterInputs['services']['publishServiceRequest'];

export type GetAllServiceCategoriesOutput =
  RouterOutputs['services']['getAllServiceCategories'];
export type GetAllservicesOutput = RouterOutputs['services']['getAllservices'];

export type ServiceItem = GetAllservicesOutput['services'][number];
export type ServiceCategoryItem =
  GetAllServiceCategoriesOutput['categories'][number];

export type UpdateServiceRequestOptions =
  ReactQueryOptions['services']['updateServiceRequest'];
export type UpdateServiceRequestInputs =
  RouterInputs['services']['updateServiceRequest'];
