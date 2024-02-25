import type { NextApiRequest, NextApiResponse } from 'next';

import { increaseDate } from '@/lib/date-fns';

import { createNotification } from '@/server/api/modules/notifications';
import { prisma } from '@/server/db';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const now = new Date();

    const serviceRequestsToClose = await prisma.serviceRequest.findMany({
      where: {
        date: {
          lte: increaseDate(now, { days: 3 }), // Add 03 days before closing the expired service requests
        },
        status: {
          not: 'CLOSED',
        },
      },
      select: {
        id: true,
        slug: true,
        title: true,
        author: { select: { profileId: true } },
      },
    });

    // Prépare les opérations de mise à jour et d'envoi de notifications dans une transaction
    const transactionActions = serviceRequestsToClose.map(serviceRequest => {
      return prisma.$transaction([
        prisma.serviceRequest.update({
          where: { id: serviceRequest.id },
          data: { status: 'CLOSED' },
        }),
        createNotification('close-service-request-expired', {
          profileId: serviceRequest.author.profileId,
          serviceRequestId: serviceRequest.id,
          serviceRequestSlug: serviceRequest.slug,
          serviceRequestTitle: serviceRequest.title,
        }),
      ]);
    });

    // Exécute toutes les transactions
    await Promise.all(transactionActions);

    res
      .status(200)
      .json({ message: 'Service requests updated and notifications sent' });
  } catch (err) {
    const error = err as Error;
    console.error(`Error updating expired service requests: ${error.message}`);
    res.status(500).json({ error: 'Error updating expired service requests' });
  }
}
