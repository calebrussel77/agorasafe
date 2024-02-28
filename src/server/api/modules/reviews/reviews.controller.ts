import {
  throwBadRequestError,
  throwDbError,
} from '@/server/utils/error-handling';

import { type Context } from '../../create-context';
import { type GetByIdQueryInput } from '../../validations/base.validations';
import { deleteReview, getReview, upsertReview } from './reviews.repository';
import { type UpsertReviewInput } from './reviews.validations';

export const upsertReviewHandler = async ({
  input,
  ctx,
}: {
  input: UpsertReviewInput;
  ctx: DeepNonNullable<Context>;
}) => {
  try {
    if (!input.id) {
      const review = await getReview({
        where: {
          serviceRequestId: input?.serviceRequestId,
          authorId: ctx.profile.id,
          reviewedProfileId: input.reviewedProfileId,
        },
      });
      if (review) {
        throwBadRequestError(
          'Vous avez déjà noté ce prestataire sur cette demande de service !'
        );
      }
    }
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
