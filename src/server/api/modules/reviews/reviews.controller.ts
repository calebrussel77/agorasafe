import {
  throwBadRequestError,
  throwDbError,
} from '@/server/utils/error-handling';

import { type Context } from '../../create-context';
import { type GetByIdQueryInput } from '../../validations/base.validations';
import { createNotification } from '../notifications';
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
    if (ctx.profile.id === input.reviewedProfileId) {
      throwBadRequestError("Vous n'avez pas le droit de faire cette action");
    }

    if (!input.reviewId) {
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
    const createdReview = await upsertReview({
      ...input,
      profileId: ctx.profile.id,
    });
    //Send notification to the reviewed profile
    await createNotification('new-service-request-profile-review', {
      profileId: input.reviewedProfileId,
      authorName: ctx.profile.name,
      reviewText: input.details ?? '',
      authorAvatar: ctx.profile.avatar,
      serviceRequestTitle: createdReview.serviceRequest?.title ?? '',
      targetSlug: createdReview.reviewedProfile?.slug ?? '',
    });

    return createdReview;
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
