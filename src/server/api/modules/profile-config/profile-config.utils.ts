import { COMMON_PROFILE_TYPE } from '@/constants';
import { ProfileType } from '@prisma/client';

export const APP_PROFILE_LINKS = [
  {
    id: 1,
    iconUrl: '/icons/home.svg',
    isSoon: false,
    type: COMMON_PROFILE_TYPE,
    title: 'Tableau de bord',
    description: 'Accéder à mon tableau de bord personnel',
    href: '/dashboard',
  },
  {
    id: 2,
    iconUrl: '/icons/clipboard-signature.svg',
    isSoon: false,
    type: ProfileType.CUSTOMER,
    title: 'Mes demandes',
    description: 'Consulter mes demandes de service',
    href: '/dashboard/my-requests',
  },
  {
    id: 3,
    iconUrl: '/icons/messages-square.svg',
    isSoon: false,
    type: COMMON_PROFILE_TYPE,
    title: 'Conversations',
    description: 'Consulter mes messages inbox',
    href: '/dashboard/inbox',
  },
  {
    id: 4,
    iconUrl: '/icons/clipboard-paste.svg',
    isSoon: true,
    title: 'Services postulés',
    type: ProfileType.PROVIDER,
    description: "Accéder aux services auxquels j'ai postulé",
    href: '/dashboard/applied-services',
  },
  {
    id: 5,
    iconUrl: '/icons/bell.svg',
    isSoon: false,
    type: COMMON_PROFILE_TYPE,
    title: 'Notifications',
    description: 'Gérer toutes mes notifications',
    href: '/dashboard/notifications',
  },
  {
    id: 6,
    iconUrl: '/icons/settings.svg',
    isSoon: true,
    type: COMMON_PROFILE_TYPE,
    title: 'Paramètres',
    description: 'Gérer mes paramètres utilisateur',
    href: '/dashboard/settings',
  },
  {
    id: 7,
    iconUrl: '/icons/user.svg',
    isSoon: false,
    type: COMMON_PROFILE_TYPE,
    title: 'Mon profil',
    description: 'Accéder à mon profil publique',
    href: '#',
  },
];

export const getAddProfileInfos = (profileType: ProfileType) => {
  if (profileType === ProfileType.CUSTOMER) {
    return {
      addNewProfileMessage: `Ajouter un profil Prestataire`,
      allowedProfileType: ProfileType.PROVIDER,
    };
  }
  return {
    addNewProfileMessage: `Ajouter un profil Client`,
    allowedProfileType: ProfileType.CUSTOMER,
  };
};

export function getFilteredLinksByType(profileType: ProfileType) {
  return APP_PROFILE_LINKS.filter(link => {
    return link.type === COMMON_PROFILE_TYPE || link.type === profileType;
  });
}
