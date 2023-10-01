import { type Prisma } from '@prisma/client';

import { prisma } from '@/server/db';

import { type GetByIdOrSlugQueryInput } from '../../validations/base.validations';
import { simpleProfileSelect } from './profiles.select';

export const getProfileBySlug = (slug: string) => {
  return prisma.profile.findUnique({
    where: { slug },
    select: { slug: true },
  });
};

export const getAllProfileDetails = ({
  inputs,
}: {
  inputs: GetByIdOrSlugQueryInput;
}) => {
  const { id, slug } = inputs;

  return prisma.profile.findUnique({
    where: { slug: slug ?? undefined, id: id ?? undefined },
    select: {
      ...simpleProfileSelect,
      bio: true,
      createdAt: true,
      websiteUrl: true,
      XUrl: true,
      aboutMe: true,
      facebookUrl: true,
      linkedinUrl: true,
      phone: false,
      customerInfo: {
        select: {
          _count: {
            select: { serviceRequests: true, providersReserved: true },
          },
        },
      },
      providerInfo: {
        select: {
          _count: { select: { ServiceRequestReservations: true } },
          skills: true,
          profession: true,
          showCaseProjects: true,
          isFaceToFace: true,
          isRemote: true,
        },
      },
      user: { select: { id: true, role: true } },
    },
  });
};

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
    select: simpleProfileSelect,
  });
}

export async function getProfilesByUserId(userId: string) {
  return prisma.profile.findMany({
    where: {
      userId,
    },
    select: simpleProfileSelect,
  });
}

export async function getProfilesWithLocationByUserId(userId: string) {
  return prisma.profile.findMany({
    where: {
      userId,
    },
    select: simpleProfileSelect,
  });
}
