import { type GetAllQueryInput } from '../../validations/base.validations';
import { createFeedback, getAllFeedbacks } from './feedbacks.repository';
import { type CreateFeedBackFormInput } from './feedbacks.validations';

export const createFeedbackService = async (
  inputs: CreateFeedBackFormInput
) => {
  const feedback = await createFeedback({ inputs });
  return {
    feedback,
    success: true,
  };
};

export const getAllFeedbackService = async (inputs: GetAllQueryInput) => {
  const feedbacks = await getAllFeedbacks({ inputs });
  return {
    feedbacks,
    success: true,
  };
};
