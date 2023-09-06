import { type Prisma } from '@prisma/client';

import { prisma } from '@/server/db';

export function createProfileByUserId({
  userId,
  ...data
}: Omit<Prisma.ProfileCreateInput, 'user'> & { userId: string }) {
  return prisma.profile.create({
    data: {
      user: { connect: { id: userId } },
      ...data,
    },
  });
}

export async function getProfiles() {
  return prisma.profile.findMany();
}

export async function getProfileById(profileId: string) {
  return prisma.profile.findUnique({
    where: { id: profileId },
  });
}

export async function getProfilesByUserId(userId: string) {
  return prisma.profile.findMany({
    where: {
      userId,
    },
  });
}

export async function getProfilesWithLocationByUserId(userId: string) {
  return prisma.profile.findMany({
    where: {
      userId,
    },
    include: {
      location: { select: { id: true, name: true, lat: true, long: true } },
    },
  });
}

export async function getProfilesCount() {
  return prisma.profile.count();
}
