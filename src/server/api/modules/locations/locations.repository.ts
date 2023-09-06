import { type Prisma } from '@prisma/client';

import { prisma } from '@/server/db';

export async function upSertLocation({
  ...data
}: Pick<Prisma.LocationUpsertArgs, 'create' | 'update' | 'where'>) {
  const locationCreated = await prisma.location.upsert({
    ...data,
  });
  return locationCreated;
}
