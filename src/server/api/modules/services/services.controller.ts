import { throwDbError } from '../../../utils/error-handling';
import { type Context } from '../../create-context';
import { type GetAllQueryInput } from '../../validations/base.validations';
import { getServiceCategories, getServices } from './services.repository';
import { type GetServicesInput } from './services.validations';

export const getServiceCategoriesHandler = async ({
  input,
}: {
  input: GetAllQueryInput;
  ctx: Omit<DeepNonNullable<Context>, 'profile' | 'user'>;
}) => {
  try {
    return await getServiceCategories(input);
  } catch (error) {
    throwDbError(error);
  }
};

export const getAllServicesHandler = async ({
  input,
}: {
  input: GetServicesInput;
  ctx: Omit<DeepNonNullable<Context>, 'profile' | 'user'>;
}) => {
  try {
    return await getServices(input);
  } catch (error) {
    throwDbError(error);
  }
};
