import {
  type ReactQueryOptions,
  type RouterInputs,
  type RouterOutputs,
} from '@/utils/api';

//Get single item
export type GetServiceRequestInput = RouterInputs['serviceRequests']['get'];
export type GetServiceRequestOptions =
  ReactQueryOptions['serviceRequests']['get'];
export type GetServiceRequestOutput = RouterOutputs['serviceRequests']['get'];

//Creation
export type CreateServiceRequestOptions =
  ReactQueryOptions['serviceRequests']['create'];
export type CreateServiceRequestInputs =
  RouterInputs['serviceRequests']['create'];

//Service requests
export type GetAllServiceRequestsOutput =
  RouterOutputs['serviceRequests']['getAll'];
export type GetAllServiceRequestsOptions =
  ReactQueryOptions['serviceRequests']['getAll'];
export type GetAllServiceRequestsInput =
  RouterInputs['serviceRequests']['getAll'];

//Reservations
export type ToggleServiceRequestReservationOutput =
  RouterOutputs['serviceRequests']['toggleReservation'];
export type ToggleServiceRequestReservationOptions =
  ReactQueryOptions['serviceRequests']['toggleReservation'];
export type ToggleServiceRequestReservationInput =
  RouterInputs['serviceRequests']['toggleReservation'];

//Proposals
export type CreateServiceRequestProposalOutput =
  RouterOutputs['serviceRequests']['createProposal'];
export type CreateServiceRequestProposalOptions =
  ReactQueryOptions['serviceRequests']['createProposal'];
export type CreateServiceRequestProposalInput =
  RouterInputs['serviceRequests']['createProposal'];

//Comments
export type CreateServiceRequestCommentOptions =
  ReactQueryOptions['serviceRequests']['createComment'];

//Services
export type GetAllServiceCategoriesOutput =
  RouterOutputs['services']['getAllServiceCategory'];
export type GetAllservicesOutput = RouterOutputs['services']['getAll'];

export type ServiceItem = GetAllservicesOutput[number];

export type ServiceCategoryItem = GetAllServiceCategoriesOutput[number];
