import { throwDbError } from '../../../utils/error-handling';
import { type GetAllQueryInput } from '../../validations/base.validations';
import {
  createServiceRequestCommentService,
  createServiceRequestService,
  getAllCategoryServicesService,
  getAllServiceRequestsService,
  getAllServicesService,
  getServiceRequestCommentsService,
  getServiceRequestService,
  updateServiceRequestService,
} from './services.service';
import type {
  CreateServiceRequestCommentInput,
  CreateServiceRequestInput,
  GetAllServiceRequestsInput,
  GetAllServicesWithCategoryInput,
  GetServiceRequestCommentsInput,
  GetServiceRequestInput,
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

export const createServiceRequestCommentController = async (
  inputs: CreateServiceRequestCommentInput,
  profileId: string
) => {
  try {
    return await createServiceRequestCommentService(inputs, profileId);
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

export const getServiceRequestCommentsController = async (
  inputs: GetServiceRequestCommentsInput
) => {
  try {
    return await getServiceRequestCommentsService(inputs);
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
