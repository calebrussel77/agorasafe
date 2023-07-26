import { type Prisma } from '@prisma/client';

import { prisma } from '@/server/db';

export async function updateUserById({
  id,
  location_id,
  ...rest
}: Omit<Prisma.UserUpdateArgs['data'], 'location'>) {
  return await prisma.user.update({
    where: { id: id as string },
    data: {
      location: {
        connect: { id: location_id as string },
      },
      ...rest,
    },
  });
}

export async function getUserById(user_id: string) {
  return prisma.user.findUnique({
    where: { id: user_id },
    include: {
      profiles: { select: { id: true, name: true, type: true } },
      _count: { select: { profiles: true } },
    },
  });
}
