import { type GetAllQueryInput } from '../../validations/base.validations';
import {
  createServiceRequest,
  getAllCategoryServices,
  getAllServicesWithCategory,
} from './services.repository';
import {
  CreateServiceRequestInput,
  type GetAllServicesWithCategoryInput,
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
  const categories = await createServiceRequest({ inputs, profileId });

  return {
    categories,
    success: true,
  };
};
