import { throwDbError } from '../../../utils/error-handling';
import { type GetAllQueryInput } from '../../validations/base.validations';
import {
  createServiceRequestService,
  getAllCategoryServicesService,
  getAllServicesService,
  getServiceRequestOffersService,
  getServiceRequestService,
} from './services.service';
import type {
  CreateServiceRequestInput,
  GetAllServicesWithCategoryInput,
  GetServiceRequestInput,
  GetServiceRequestOffersInput,
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
