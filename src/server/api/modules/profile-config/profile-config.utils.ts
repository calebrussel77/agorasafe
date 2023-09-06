import { APP_PROFILE_LINKS, COMMON_PROFILE_TYPE } from '@/constants';
import { ProfileType } from '@prisma/client';

export const getAddProfileInfos = (profileType: ProfileType) => {
  if (profileType === ProfileType.CUSTOMER) {
    return {
      addNewProfileMessage: `Ajouter un profil Prestataire`,
      addNewProfileHref: `/onboarding/add-new-profile?profile_type=${ProfileType.PROVIDER}`,
    };
  }
  return {
    addNewProfileMessage: `Ajouter un profil Client`,
    addNewProfileHref: `/onboarding/add-new-profile?profile_type=${ProfileType.CUSTOMER}`,
  };
};

export function getFilteredLinksByType(profileType: ProfileType) {
  return APP_PROFILE_LINKS.filter(link => {
    return link.type === COMMON_PROFILE_TYPE || link.type === profileType;
  });
}
