import { ProfileType } from '@prisma/client';

export const getProfileTypeName = (type: ProfileType) => {
  return type === ProfileType.PROVIDER ? 'Prestataire' : 'Client';
};

export const getIsCustomer = (profileType: ProfileType) =>
  profileType === ProfileType.CUSTOMER;

export const getIsFaceToFaceLabel = (isFaceToFace?: boolean | null) => {
  if (isFaceToFace === true) {
    return 'Je peux me déplacer en face à face';
  }
  return 'Je ne me déplace pas';
};

export const getIsRemoteLabel = (isRemote?: boolean | null) => {
  if (isRemote === true) {
    return 'Je travail à distance';
  }
  return 'Je ne travail pas à distance';
};
