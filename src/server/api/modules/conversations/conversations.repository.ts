import { type Prisma } from '@prisma/client';

import { prisma } from '@/server/db';

import { CONVERSATIONS_CHUNK } from '../../constants';
import { simpleProfileSelect } from '../profiles';
import { type GetConversationsInput } from './conversations.validations';

export async function getOrCreateConversation({
  inputs,
}: {
  inputs: { profileOneId: string; profileTwoId: string };
}) {
  const { profileOneId, profileTwoId } = inputs;
  let conversation =
    (await getConversationBetweenTwoProfiles(profileOneId, profileTwoId)) ||
    (await getConversationBetweenTwoProfiles(profileTwoId, profileOneId));

  if (!conversation) {
    conversation = await createNewConversation(profileOneId, profileTwoId);
  }

  return conversation;
}

function getConversationBetweenTwoProfiles(
  profileOneId: string,
  profileTwoId: string
) {
  // if something goes wrong we return null instead of blocking the entire application
  try {
    return prisma.conversation.findFirst({
      where: { AND: [{ profileOneId }, { profileTwoId }] },
      include: {
        profileOne: { select: simpleProfileSelect },
        profileTwo: { select: simpleProfileSelect },
      },
    });
  } catch (e) {
    console.log({ e });

    return null;
  }
}

function createNewConversation(profileOneId: string, profileTwoId: string) {
  // if something goes wrong we return null instead of blocking the entire application
  try {
    return prisma.conversation.create({
      data: {
        profileOneId,
        profileTwoId,
      },
      include: {
        profileOne: { select: simpleProfileSelect },
        profileTwo: { select: simpleProfileSelect },
      },
    });
  } catch (e) {
    console.log({ e });

    return null;
  }
}

export function getConversations(inputs: GetConversationsInput) {
  const {
    limit = CONVERSATIONS_CHUNK,
    orderBy = 'desc',
    query,
    profileId,
    cursor,
  } = inputs;

  const OR: Prisma.ConversationWhereInput[] | undefined = [];

  if (profileId) {
    OR.push({ profileOneId: profileId }, { profileTwoId: profileId });
  }

  if (query) {
    OR.push(
      { profileOne: { name: { contains: query } } },
      { profileTwo: { name: { contains: query } } }
    );
  }

  return prisma.conversation.findMany({
    where: {
      OR,
    },
    cursor: cursor ? { id: cursor } : undefined,
    skip: cursor ? 1 : undefined,
    take: limit,
    include: {
      directMessages: { take: 1, orderBy: { createdAt: 'desc' } },
      profileOne: { select: simpleProfileSelect },
      profileTwo: { select: simpleProfileSelect },
    },
    orderBy: { createdAt: orderBy },
  });
}
