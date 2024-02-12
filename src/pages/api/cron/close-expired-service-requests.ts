import type { NextApiRequest, NextApiResponse } from 'next';

import { formatYearMonthDay } from '@/lib/date-fns';

import { createNotification } from '@/server/api/modules/notifications';
import { prisma } from '@/server/db';
import { throwDbError } from '@/server/utils/error-handling';

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse
) {
  try {
    const now = new Date();

    //TODO : improve this by using batch updates

    const expiredServiceRequests = await prisma.serviceRequest.findMany({
      where: {
        date: {
          lte: formatYearMonthDay(now),
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
      await Promise.all(
        expiredServiceRequests.map(async serviceRequest => {
          //Send notifications to author
          await createNotification('close-service-request-expired', {
            profileId: serviceRequest?.author?.profileId,
            serviceRequestId: serviceRequest?.id,
            serviceRequestSlug: serviceRequest?.slug,
            serviceRequestTitle: serviceRequest?.title,
          });

          return prisma.serviceRequest.update({
            where: {
              id: serviceRequest.id,
            },
            data: {
              status: 'CLOSED',
            },
            select: { id: true },
          });
        })
      );
    }
  } catch (e) {
    throwDbError(e);
  }

  response.status(200).json({ success: true });
}
