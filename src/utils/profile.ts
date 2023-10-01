import { ProfileType } from '@prisma/client';

export const getProfileTypeName = (type: ProfileType) => {
  return type === ProfileType.PROVIDER ? 'Prestataire' : 'Client';
};

export const getIsCustomer = (profileType: ProfileType) =>
  profileType === ProfileType.CUSTOMER;

export const getIsFaceToFaceLabel = (isFaceToFace?: boolean | null) => {
  if (isFaceToFace === true) {
    return 'Peut se déplacer en face à face';
  }
  return 'Ne se déplace pas';
};

export const getIsRemoteLabel = (isRemote?: boolean | null) => {
  if (isRemote === true) {
    return 'Travail à distance';
  }
  return 'Ne travail pas à distance';
};
