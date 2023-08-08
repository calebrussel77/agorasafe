import { type Prisma } from '@prisma/client';

import { prisma } from '@/server/db';

export async function createLocation({
  name,
  lat,
  long,
  ...rest
}: Prisma.LocationCreateArgs['data']) {
  const locationCreated = await prisma.location.create({
    data: {
      name,
      lat,
      long,
      ...rest,
    },
  });
  return locationCreated;
}
