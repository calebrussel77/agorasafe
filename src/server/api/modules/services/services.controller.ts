import { throwDbError } from '../../../utils/error-handling';
import { type GetAllQueryInput } from '../../validations/base.validations';
import {
  createServiceRequestService,
  getAllCategoryServicesService,
  getAllServiceRequestsService,
  getAllServicesService,
  getServiceRequestOffersService,
  getServiceRequestService,
  updateServiceRequestService,
} from './services.service';
import type {
  CreateServiceRequestInput,
  GetAllServiceRequestsInput,
  GetAllServicesWithCategoryInput,
  GetServiceRequestInput,
  GetServiceRequestOffersInput,
  UpdateServiceRequestInput,
} from './services.validations';

export const getAllServicesController = async (
  inputs: GetAllServicesWithCategoryInput
) => {
  try {
    return await getAllServicesService(inputs);
  } catch (error) {
    throwDbError(error);
  }
};

export const getAllServiceCategoriesController = async (
  inputs: GetAllQueryInput
) => {
  try {
    return await getAllCategoryServicesService(inputs);
  } catch (error) {
    throwDbError(error);
  }
};

export const createServiceRequestController = async (
  inputs: CreateServiceRequestInput,
  profileId: string
) => {
  try {
    return await createServiceRequestService(inputs, profileId);
  } catch (error) {
    throwDbError(error);
  }
};

export const updateServiceRequestController = async (
  inputs: UpdateServiceRequestInput
) => {
  try {
    return await updateServiceRequestService(inputs);
  } catch (error) {
    throwDbError(error);
  }
};

export const getServiceRequestController = async (
  inputs: GetServiceRequestInput
) => {
  try {
    return await getServiceRequestService(inputs);
  } catch (error) {
    throwDbError(error);
  }
};

export const getServiceRequestOffersController = async (
  inputs: GetServiceRequestOffersInput
) => {
  try {
    return await getServiceRequestOffersService(inputs);
  } catch (error) {
    throwDbError(error);
  }
};

export const getAllServiceRequestsController = async (
  inputs: GetAllServiceRequestsInput
) => {
  try {
    return await getAllServiceRequestsService(inputs);
  } catch (error) {
    throwDbError(error);
  }
};
