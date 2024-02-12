import { prisma } from '@/server/db';

import {
  throwDbError,
  throwForbiddenError,
  throwNotFoundError,
} from '../../../utils/error-handling';
import { type Context } from '../../create-context';
import { type GetByIdQueryInput } from '../../validations/base.validations';
import {
  type CommentConnectorInput,
  type GetCommentsInput,
  type UpsertCommentInput,
  deleteComment,
  getComment,
  getCommentCount,
  getComments,
  upsertComment,
} from '../comments';
import { createNotification } from '../notifications';
import { CommentSelect } from './comments.select';

export const getInfiniteCommentsHandler = async ({
  ctx,
  input,
}: {
  ctx: Context;
  input: GetCommentsInput;
}) => {
  try {
    const limit = input.limit + 1;

    const comments = await getComments({
      ...input,
      limit,
      select: CommentSelect,
    });

    let nextCursor: string | undefined;
    if (comments.length > input.limit) {
      const nextItem = comments.pop();
      nextCursor = nextItem?.id;
    }

    return {
      nextCursor,
      comments,
    };
  } catch (error) {
    throw throwDbError(error);
  }
};

export const getCommentHandler = async ({
  ctx,
  input,
}: {
  ctx: Context;
  input: GetByIdQueryInput;
}) => {
  try {
    return await getComment({ ...input });
  } catch (error) {
    throw throwDbError(error);
  }
};

export const upsertCommentHandler = async ({
  ctx,
  input,
}: {
  ctx: DeepNonNullable<Context>;
  input: UpsertCommentInput;
}) => {
  try {
    if (input.entityType === 'service-request') {
      const serviceRequest = await prisma.serviceRequest.findUnique({
        where: { id: input.entityId },
        select: {
          author: { select: { profileId: true } },
          id: true,
          slug: true,
          title: true,
          status: true,
        },
      });

      if (!serviceRequest) {
        throwNotFoundError('Demande de service non trouvée !');
      }

      if (serviceRequest.status === 'CLOSED') {
        throwForbiddenError('Cette demande à été clôturée !');
      }

      const serviceRequestOwnerId = serviceRequest.author.profileId;

      const comment = await upsertComment({
        ...input,
        profileId: ctx.profile.id,
      });

      // Ne pas notifier si l'utilisateur commente sa propre demande de service
      // Créer une notification pour l'auteur de la demande de service
      if (serviceRequestOwnerId !== ctx.profile.id) {
        await createNotification('new-service-request-comment', {
          profileId: serviceRequestOwnerId,
          profileAvatar: comment?.author?.avatar,
          profileName: comment?.author?.name,
          serviceRequestId: serviceRequest?.id,
          serviceRequestSlug: serviceRequest?.slug,
          serviceRequestTitle: serviceRequest?.title,
          commentText: input.text,
        });
      }
      return comment;
    }

    return null;
  } catch (error) {
    throw throwDbError(error);
  }
};

export const deleteCommentHandler = async ({
  ctx,
  input,
}: {
  ctx: DeepNonNullable<Context>;
  input: GetByIdQueryInput;
}) => {
  try {
    const deleted = await deleteComment(input);
    if (!deleted)
      throw throwNotFoundError(`Aucun commentaire avec cet id: ${input.id}`);

    return deleted;
  } catch (error) {
    throw throwDbError(error);
  }
};

export const getCommentCountHandler = async ({
  ctx,
  input,
}: {
  ctx: Context;
  input: CommentConnectorInput;
}) => {
  try {
    return await getCommentCount(input);
  } catch (error) {
    throw throwDbError(error);
  }
};
