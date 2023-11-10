import { prisma } from '@/server/db';

export const getSkills = async () => {
  return prisma.skill.findMany();
};
