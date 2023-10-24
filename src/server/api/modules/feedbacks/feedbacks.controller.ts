import { throwDbError } from '@/server/utils/error-handling';

import { type GetAllQueryInput } from '../../validations/base.validations';
import {
  createFeedbackService,
  getAllFeedbackService,
} from './feedbacks.service';
import { type CreateFeedBackFormInput } from './feedbacks.validations';

export const createFeedbackController = async (
  inputs: CreateFeedBackFormInput
) => {
  try {
    return await createFeedbackService(inputs);
  } catch (e) {
    throwDbError(e);
  }
};

export const getAllFeedbackController = async (inputs: GetAllQueryInput) => {
  try {
    return await getAllFeedbackService(inputs);
  } catch (e) {
    throwDbError(e);
  }
};
