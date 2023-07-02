import { type Prisma } from '@prisma/client';

import { prisma } from '@/server/db';

export async function updateUserById({
  id,
  locationId,
  ...rest
}: Omit<Prisma.UserUpdateArgs['data'], 'id' | 'location' | 'location_id'> & {
  locationId: string;
  id: string;
}) {
  return await prisma.user.update({
    where: { id },
    data: {
      location: {
        connect: { id: locationId },
      },
      ...rest,
    },
  });
}
