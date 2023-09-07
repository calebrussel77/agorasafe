import { throwDbError } from '../../../utils/error-handling';
import { type GetAllQueryInput } from '../../validations/base.validations';
import {
  getAllCategoryServicesService,
  getAllServicesService,
} from './services.service';
import { type GetAllServicesWithCategoryInput } from './services.validations';

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
