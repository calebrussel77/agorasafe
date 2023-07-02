/* eslint-disable @typescript-eslint/no-unsafe-return */

/* eslint-disable @typescript-eslint/no-unsafe-call */

/* eslint-disable @typescript-eslint/no-unsafe-member-access */

/* eslint-disable @typescript-eslint/no-unsafe-assignment */
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
