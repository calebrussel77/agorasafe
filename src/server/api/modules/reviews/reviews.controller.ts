import { throwDbError } from '@/server/utils/error-handling';

import { type Context } from '../../create-context';
import { type GetByIdQueryInput } from '../../validations/base.validations';
import { deleteReview, upsertReview } from './reviews.repository';
import { type UpsertReviewInput } from './reviews.validations';

export const upsertReviewHandler = async ({
  input,
  ctx,
}: {
  input: UpsertReviewInput;
  ctx: DeepNonNullable<Context>;
}) => {
  try {
    return await upsertReview({ ...input, profileId: ctx.profile.id });
  } catch (error) {
    throw throwDbError(error);
  }
};

export const deleteReviewHandler = async ({
  input,
  ctx,
}: {
  input: GetByIdQueryInput;
  ctx: DeepNonNullable<Context>;
}) => {
  try {
    const result = await deleteReview(input);
    return result;
  } catch (error) {
    throw throwDbError(error);
  }
};
