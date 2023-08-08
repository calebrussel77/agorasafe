import { ProfileType } from '@prisma/client';

export const getProfileTypeName = (type: ProfileType) => {
  return type === ProfileType.PROVIDER ? 'Prestataire' : 'Client';
};

export const getIsCustomer = (profileType: ProfileType) =>
  profileType === ProfileType.CUSTOMER;
