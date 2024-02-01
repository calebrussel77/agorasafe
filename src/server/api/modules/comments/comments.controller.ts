import {
  throwDbError,
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
    const result = await upsertComment({ ...input, profileId: ctx.profile.id });
    return result;
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
