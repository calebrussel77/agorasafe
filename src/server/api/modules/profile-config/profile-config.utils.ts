import { profileLinks } from '@/constants';
import { ProfileType } from '@prisma/client';

export const getAddProfileInfos = (profileType: ProfileType) => {
  if (profileType === ProfileType.CUSTOMER) {
    return {
      message: `Ajouter un profile Prestataire`,
      href: `/add-new-profile?profile_type=${ProfileType.PROVIDER}`,
    };
  }
  return {
    message: `Ajouter un profile Client`,
    href: `/add-new-profile?profile_type=${ProfileType.CUSTOMER}`,
  };
};

export function getFilteredLinksByType(profileType: ProfileType) {
  const COMMON_TYPE = 'COMMON';

  return profileLinks.filter(link => {
    return link.type === COMMON_TYPE || link.type === profileType;
  });
}
