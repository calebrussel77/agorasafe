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

export type GetAllServiceCategoriesOutput =
  RouterOutputs['services']['getAllServiceCategories'];
export type GetAllservicesOutput = RouterOutputs['services']['getAllservices'];

export type ServiceItem = GetAllservicesOutput['services'][number];
export type ServiceCategoryItem =
  GetAllServiceCategoriesOutput['categories'][number];

export type GetAllServiceRequestsOutput =
  RouterOutputs['services']['getAllServiceRequests'];
export type GetAllServiceRequestsOptions =
  ReactQueryOptions['services']['getAllServiceRequests'];
export type GetAllServiceRequestsInput =
  RouterInputs['services']['getAllServiceRequests'];

  export type ToggleServiceRequestReservationOutput =
  RouterOutputs['services']['toggleServiceRequestReservation'];
export type ToggleServiceRequestReservationOptions =
  ReactQueryOptions['services']['toggleServiceRequestReservation'];
export type ToggleServiceRequestReservationInput =
  RouterInputs['services']['toggleServiceRequestReservation'];

export type CreateServiceRequestCommentOptions =
  ReactQueryOptions['services']['createServiceRequestComment'];
