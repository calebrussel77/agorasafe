import { prisma } from '@/server/db';

export async function deleteSessionsByUserId(userId: string) {
  return prisma.session.deleteMany({
    where: { userId },
  });
}
