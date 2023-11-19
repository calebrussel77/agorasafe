import { CommentSort } from '@/shared/enums';
import { type Prisma } from '@prisma/client';

import { prisma } from '@/server/db';
import {
  throwBadRequestError,
  throwNotFoundError,
} from '@/server/utils/error-handling';

import { type GetByIdQueryInput } from '../../validations/base.validations';
import { CommentSelect } from './comments.select';
import {
  type CommentConnectorInput,
  type GetCommentsInput,
  type UpsertCommentInput,
} from './comments.validations';

export const upsertComment = async ({
  profileId,
  entityType,
  entityId,
  ...data
}: UpsertCommentInput & { profileId: string }) => {
  let dataInput: Prisma.CommentCreateInput | null = null;

  if (entityType === 'service-request') {
    dataInput = {
      author: { connect: { id: profileId } },
      serviceRequest: { connect: { id: entityId } },
      text: data.text,
    };
  }

  if (!dataInput) {
    throw throwBadRequestError('Aucun type de commentaire selectioné');
  }

  if (!data.id) {
    return prisma.comment.create({
      data: dataInput,
      select: CommentSelect,
    });
  }
  return prisma.comment.update({
    where: { id: data.id },
    data: dataInput,
    select: CommentSelect,
  });
};

export const getComment = async ({ id }: GetByIdQueryInput) => {
  const comment = await prisma.comment.findFirst({
    where: { id },
    select: CommentSelect,
  });

  if (!comment) throw throwNotFoundError();

  return comment;
};

export const getComments = async <TSelect extends Prisma.CommentSelect>({
  entityType,
  entityId,
  limit,
  cursor,
  select,
  sort = CommentSort.Newest,
}: GetCommentsInput & {
  select: TSelect;
}) => {
  const orderBy: Prisma.Enumerable<Prisma.CommentOrderByWithRelationInput> = [];
  let where: Prisma.CommentWhereInput | undefined = undefined;

  if (sort === CommentSort.Newest) orderBy.push({ createdAt: 'desc' });
  else orderBy.push({ createdAt: 'asc' });

  if (entityType === 'service-request') {
    where = {
      serviceRequestId: entityId,
    };
  }

  return await prisma.comment.findMany({
    take: limit,
    cursor: cursor ? { id: cursor } : undefined,
    where,
    orderBy,
    select,
  });
};

export const deleteComment = ({ id }: { id: string }) => {
  return prisma.comment.delete({ where: { id } });
};

export const getCommentCount = async ({
  entityId,
  entityType,
}: CommentConnectorInput) => {
  let where: Prisma.CommentWhereInput | undefined = undefined;

  if (entityType === 'service-request') {
    where = {
      serviceRequestId: entityId,
    };
  }
  return await prisma.comment.count({
    where,
  });
};
