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

export const getSessionUser = async ({ userId }: { userId?: string }) => {
  if (!userId) return undefined;

  const user = await prisma.user.findFirst({
    where: {
      id: userId,
    },
    include: {
      _count: { select: { profiles: true } },
      profiles: {
        select: { name: true, id: true, type: true, avatar: true },
      },
    },
  });

  if (!user) return undefined;

  return {
    id: user?.id,
    tos: user?.tos,
    name: user?.fullName,
    email: user?.email,
    avatar: user?.picture,
    role: user?.role,
    onboardingComplete: user?.onboardingComplete,
    createdProfiles: user?.profiles,
    createdProfilesCount: user?._count?.profiles,
  };
};

export function getUserByEmail(userEmail: string) {
  return prisma.user.findUnique({
    where: { email: userEmail },
    select: {
      id: true,
      role: true,
    },
  });
}

export const acceptTOS = ({ id }: { id: string }) => {
  return prisma.user.update({
    where: { id },
    data: { tos: true },
  });
};

export const completeOnboarding = async ({ id }: { id: string }) => {
  return prisma.user.update({
    where: { id },
    data: { onboardingComplete: true },
  });
};
