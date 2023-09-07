import { type GetAllQueryInput } from '../../validations/base.validations';
import {
  getAllCategoryServices,
  getAllServicesWithCategory,
} from './services.repository';
import { type GetAllServicesWithCategoryInput } from './services.validations';

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
