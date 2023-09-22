import { type Prisma } from '@prisma/client';

import { prisma } from '@/server/db';

export function updateUserById({ id, ...rest }: Prisma.UserUpdateArgs['data']) {
  return prisma.user.update({
    where: { id: id as string },
    data: {
      ...rest,
    },
  });
}

export function getUserById(userId: string) {
  return prisma.user.findUnique({
    where: { id: userId },
    include: {
      profiles: { select: { id: true, name: true, type: true } },
      _count: { select: { profiles: true } },
    },
  });
}

export function getUserByEmail(userEmail: string) {
  return prisma.user.findUnique({
    where: { email: userEmail },
    select: {
      id: true,
      hasBeenOnboarded: true,
      role: true,
    },
  });
}
