import { ProfileType } from '@prisma/client';

export const getProfileType = (type: ProfileType) => {
  return type === ProfileType.PROVIDER ? 'Prestataire' : 'Client';
};
