import { getInitialState } from '@/stores/profile-store/initial-state';
import { type NextApiRequest } from 'next';
import { z } from 'zod';

import { type NextApiResponseServerIo } from '@/types/socket-io';

import { socketEventsKey } from '@/server/api/constants';
import { createDirectMessage } from '@/server/api/modules/messages';
import { getServerAuthSession } from '@/server/auth';
import { prisma } from '@/server/db';
import {
  throwAuthorizationError,
  throwBadRequestError,
  throwDbError,
  throwNotFoundError,
} from '@/server/utils/error-handling';

const reqBodySchema = z
  .object({
    content: z.string().trim(),
    fileUrl: z.string(),
  })
  .partial()
  .refine(
    data => data.content || data.fileUrl,
    'Le texte ou le fichier de votre message est requis.'
  );

const reqQuerySchema = z.object({
  conversationId: z.string(),
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponseServerIo
) {
  if (req.method !== 'POST') {
    throwBadRequestError('Methode non authorizée !');
  }

  try {
    const resultBody = reqBodySchema.safeParse(req.body);
    const resultQuery = reqQuerySchema.safeParse(req.query);

    if (!resultBody.success)
      throwBadRequestError(resultBody.error.errors[0]?.message);
    if (!resultQuery.success)
      throwBadRequestError(resultQuery.error.errors[0]?.message);

    const session = await getServerAuthSession({ req, res });
    const { profile } = getInitialState(req.headers);

    if (!session || !profile) throwAuthorizationError();

    const { conversationId } = resultQuery.data;
    const { content, fileUrl } = resultBody.data;

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

    if (!conversation)
      throwNotFoundError('Impossible de trouver la conversation');

    const user =
      conversation.profileOne.id === profile.id
        ? conversation.profileOne
        : conversation.profileTwo;

    if (!user) throwNotFoundError('Impossible de trouver cet utisateur');

    const directMessage = await createDirectMessage({
      content,
      conversationId,
      fileUrl,
      profileId: user.id,
    });

    const eventKey = socketEventsKey['directMessageCreate'](conversationId);

    res?.socket?.server?.io?.emit(eventKey, directMessage);

    return res.status(200).json(directMessage);
  } catch (e) {
    console.error(e);
    throwDbError(e);
  }
} 
