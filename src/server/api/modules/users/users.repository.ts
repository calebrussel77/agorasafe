import { type Prisma } from '@prisma/client';

import { prisma } from '@/server/db';

export async function updateUserById({
  id,
  locationId,
  ...rest
}: Omit<Prisma.UserUpdateArgs['data'], 'location'>) {
  return await prisma.user.update({
    where: { id: id as string },
    data: {
      location: {
        connect: { id: locationId as string },
      },
      ...rest,
    },
  });
}

export async function getUserById(userId: string) {
  return prisma.user.findUnique({
    where: { id: userId },
    include: {
      profiles: { select: { id: true, name: true, type: true } },
      _count: { select: { profiles: true } },
    },
  });
}
