import { throwBadRequestError } from '@/server/utils/error-handling';

import { type GetAllQueryInput } from '../../validations/base.validations';
import {
  createServiceRequest,
  getAllCategoryServices,
  getAllServicesWithCategory,
  getServiceRequestWithDetails,
} from './services.repository';
import {
  type CreateServiceRequestInput,
  type GetAllServicesWithCategoryInput,
  type GetServiceRequestInput,
} from './services.validations';

export const getAllServicesService = async (
  inputs: GetAllServicesWithCategoryInput
) => {
  const services = await getAllServicesWithCategory(inputs);

  return {
    services,
    success: true,
  };
};

export const getAllCategoryServicesService = async (
  inputs: GetAllQueryInput
) => {
  const categories = await getAllCategoryServices(inputs);

  return {
    categories,
    success: true,
  };
};

export const createServiceRequestService = async (
  inputs: CreateServiceRequestInput,
  profileId: string
) => {
  const serviceRequest = await createServiceRequest({ inputs, profileId });

  return {
    serviceRequest,
    success: true,
  };
};

export const getServiceRequestService = async (
  inputs: GetServiceRequestInput,
  profileId: string
) => {
  if (!inputs.id && !inputs.slug)
    throwBadRequestError("L'id ou le slug est requis");

  const serviceRequestDetails = await getServiceRequestWithDetails({
    inputs,
    profileId,
  });

  return {
    serviceRequest: serviceRequestDetails,
    success: true,
  };
};
