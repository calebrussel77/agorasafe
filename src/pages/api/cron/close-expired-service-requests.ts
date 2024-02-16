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

    const expiredServiceRequests = await prisma.serviceRequest.findMany({
      where: {
        date: {
          lte: increaseDate(now, { days: 3 }), // Add two days before closing the expired service requests
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

    if (expiredServiceRequests.length > 0) {
      const updateOperations = expiredServiceRequests.map(serviceRequest => {
        // Notification creation is a side-effect and doesn't need to be part of the transaction
        void createNotification('close-service-request-expired', {
          profileId: serviceRequest.author.profileId,
          serviceRequestId: serviceRequest.id,
          serviceRequestSlug: serviceRequest.slug,
          serviceRequestTitle: serviceRequest.title,
        });

        // Update operation for transaction
        return prisma.serviceRequest.update({
          where: { id: serviceRequest.id },
          data: { status: 'CLOSED' },
        });
      });

      // Execute all update operations in a transaction
      await prisma.$transaction(updateOperations);
    }

    res.status(200).json({ success: true });
  } catch (err) {
    const error = err as Error;
    console.error(`Error updating expired service requests: ${error.message}`);
    res.status(500).json({ error: 'Error updating expired service requests' });
  }
}
