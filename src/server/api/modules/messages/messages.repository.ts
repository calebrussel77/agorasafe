import { type Prisma } from '@prisma/client';

import { prisma } from '@/server/db';

import { DIRECT_MESSAGES_CHUNK } from '../../constants';
import { simpleProfileSelect } from '../profiles';
import {
  type CreateDirectMessageInput,
  type DeleteDirectMessageInput,
  type GetDirectMessagesInput,
  type UpdateDirectMessageInput,
} from './messages.validations';

export function createDirectMessage(inputs: CreateDirectMessageInput) {
  const { content, conversationId, fileUrl, profileId } = inputs;

  return prisma.directMessage.create({
    data: {
      content,
      fileUrl,
      conversationId,
      profileId,
    },
    include: { profile: { select: simpleProfileSelect } },
  });
}

export function updateDirectMessage(inputs: UpdateDirectMessageInput) {
  const { directMessageId, content } = inputs;

  return prisma.directMessage.update({
    where: {
      id: directMessageId,
    },
    data: {
      content,
    },
    include: { profile: { select: simpleProfileSelect } },
  });
}

export function deleteDirectMessage(inputs: DeleteDirectMessageInput) {
  const { directMessageId } = inputs;

  return prisma.directMessage.update({
    where: {
      id: directMessageId,
    },
    data: {
      content: 'Ce message a été supprimé',
      fileUrl: null,
      deletedAt: new Date(),
    },
    include: { profile: { select: simpleProfileSelect } },
  });
}

export function getDirectMessages(inputs: GetDirectMessagesInput) {
  const {
    limit = DIRECT_MESSAGES_CHUNK,
    orderBy = 'desc',
    query,
    conversationId,
    cursor,
  } = inputs;

  let OR: Prisma.DirectMessageWhereInput[] | undefined = undefined;

  if (query) OR = [{ content: { contains: query } }];

  return prisma.directMessage.findMany({
    where: {
      conversationId,
      OR,
    },
    cursor: cursor ? { id: cursor } : undefined,
    skip: cursor ? 1 : undefined,
    take: limit,
    include: { profile: { select: simpleProfileSelect } },
    orderBy: { createdAt: orderBy },
  });
}
