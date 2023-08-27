import { throwDbError } from '../../../utils/error-handling';
import { authService } from './auth.service';
import { type AuthValidation } from './auth.validations';

export const authController = async (inputs: AuthValidation) => {
  try {
    const serviceResponse = await authService(inputs);
    
    return {
      ...serviceResponse,
      success: true,
    };
  } catch (error) {
    throwDbError(error);
  }
};
