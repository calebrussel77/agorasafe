import { type Prisma, ProfileType } from '@prisma/client';

import { prisma } from '@/server/db';

import { type GetByIdOrSlugQueryInput } from '../../validations/base.validations';
import { simpleProfileSelect } from './profiles.select';

export const getProfileBySlug = (slug: string) => {
  return prisma.profile.findUnique({
    where: { slug },
    select: { slug: true },
  });
};

export const getProfileStats = ({
  input: { id, slug },
}: {
  input: GetByIdOrSlugQueryInput;
}) => {
  return prisma.profile.findUnique({
    where: {
      id: id ?? undefined,
      slug: slug ?? undefined,
    },
    select: {
      id: true,
      customerInfo: {
        select: {
          _count: {
            select: {
              providersReserved: { where: { isActive: true, removedAt: null } },
              serviceRequests: true,
            },
          },
        },
      },
      providerInfo: {
        select: {
          _count: {
            select: {
              proposals: { where: { isArchived: false } },
              showCaseProjects: true,
              serviceRequestReservations: {
                where: { isActive: true, removedAt: null },
              },
            },
          },
        },
      },
      _count: {
        select: { comments: true, createdReviews: true, receivedReviews: true },
      },
    },
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
      providerInfo: {
        select: {
          skills: true,
          profession: true,
          showCaseProjects: {
            select: {
              id: true,
              photo: { select: { name: true, url: true } },
              title: true,
              description: true,
            },
          },
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
    select: simpleProfileSelect,
  });
}

export function updateProfileById(
  inputs: Prisma.ProfileUpdateInput & { profileId: string }
) {
  return prisma.profile.update({
    where: { id: inputs.profileId },
    data: inputs,
  });
}

export async function getProfiles(profileType?: ProfileType) {
  return prisma.profile.findMany({
    where: profileType ? { type: profileType } : undefined,
    select: simpleProfileSelect,
  });
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
