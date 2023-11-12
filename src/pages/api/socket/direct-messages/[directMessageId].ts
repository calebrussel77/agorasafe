/* eslint-disable @typescript-eslint/ban-ts-comment */
import { getInitialState } from '@/stores/profile-store/initial-state';
import { Role } from '@prisma/client';
import { type NextApiRequest } from 'next';
import { z } from 'zod';

import { type NextApiResponseServerIo } from '@/types/socket-io';

import { socketEventsKey } from '@/server/api/constants';
import {
  deleteDirectMessage,
  updateDirectMessage,
} from '@/server/api/modules/messages';
import { simpleProfileSelect } from '@/server/api/modules/profiles';
import { getServerAuthSession } from '@/server/auth';
import { prisma } from '@/server/db';

const reqQuerySchema = z.object({
  conversationId: z.string(),
  directMessageId: z.string(),
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponseServerIo
) {
  if (req.method !== 'DELETE' && req.method !== 'PATCH') {
    throw new Error('Methode non authorizée !');
  }

  try {
    const resultQuery = reqQuerySchema.safeParse(req.query);

    if (!resultQuery.success)
      throw new Error(resultQuery.error.format()._errors[0]);

    const session = await getServerAuthSession({ req, res });
    const { profile } = getInitialState(req.headers);

    if (!session || !profile)
      throw new Error("Vous n'avez pas le droit d'effectuer cette action !");

    const { directMessageId, conversationId } = resultQuery.data;
    const content = (req.body as { content: string })?.content;

    const conversation = await prisma.conversation.findFirst({
      where: {
        id: conversationId,
        OR: [{ profileOneId: profile.id }, { profileTwoId: profile.id }],
      },
      include: {
        profileOne: { select: { id: true } },
        profileTwo: { select: { id: true } },
      },
    });

    if (!conversation) throw new Error('Impossible de trouver la conversation');

    const user =
      conversation.profileOne.id === profile.id
        ? conversation.profileOne
        : conversation.profileTwo;

    if (!user) throw new Error('Impossible de trouver cet utilisateur');

    let directMessage = await prisma.directMessage.findFirst({
      where: {
        id: directMessageId,
        conversationId,
      },
      include: { profile: { select: simpleProfileSelect } },
    });

    if (!directMessage || directMessage.deletedAt)
      throw new Error('Impossible de trouver ce message');

    const isMessageOwner = directMessage.profile.id === user.id;
    const isAdmin = session?.user?.role === Role.ADMIN;
    const canModify = isMessageOwner || isAdmin;

    if (!canModify)
      throw new Error("Vous n'avez pas le droit d'effectuer cette action !");

    if (req.method === 'DELETE') {
      directMessage = await deleteDirectMessage({ directMessageId });
    }

    if (req.method === 'PATCH') {
      if (!isMessageOwner)
        throw new Error("Vous n'avez pas le droit d'effectuer cette action !");

      directMessage = await updateDirectMessage({ directMessageId, content });
    }

    const eventKey = socketEventsKey['updateDirectMessage'](conversation.id);

    res?.socket?.server?.io?.emit(eventKey, directMessage);

    return res.status(200).json(directMessage);
  } catch (e: unknown) {
    console.log(e);
  }
}
