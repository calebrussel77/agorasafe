import { ProfileType } from '@prisma/client';

export const USER_PROFILES_LIMIT_COUNT = 2;

export const COMMON_TYPE = 'COMMON';

export const siteProfiles = [
  {
    title: 'Prestataire',
    description: `Je souhaite vendre mes services auprès des clients de la plateforme.`,
    type: ProfileType.PROVIDER,
  },
  {
    title: 'Client',
    description: `Je souhaite créer des démandes de services et payer des personnes capables de satisfaire mes besoins.`,
    type: ProfileType.CUSTOMER,
  },
];

export const profileLinks = [
  {
    id: 1,
    Icon: 'Home',
    disabled: false,
    type: COMMON_TYPE,
    title: 'Tableau de bord',
    description: 'Accéder à mon tableau de bord personnel',
    href: '/dashboard',
  },
  {
    id: 2,
    Icon: 'Package2',
    disabled: false,
    type: ProfileType.CUSTOMER,
    title: 'Mes demandes',
    description: 'Consulter mes demandes de service',
    href: '/dashboard/my-requests',
  },
  {
    id: 3,
    Icon: 'MessagesSquare',
    disabled: false,
    type: COMMON_TYPE,
    title: 'Conversations',
    description: 'Consulter mes messages inbox',
    href: '/dashboard/inbox',
  },
  {
    id: 4,
    Icon: 'Dumbbell',
    disabled: false,
    title: 'Services postulés',
    type: ProfileType.PROVIDER,
    description: "Accéder aux services auxquels j'ai postulé",
    href: '/dashboard/applied-services',
  },
  {
    id: 6,
    Icon: 'Settings2',
    disabled: false,
    type: COMMON_TYPE,
    title: 'Paramètres',
    description: 'Gérer mes paramètres utilisateur',
    href: '/dashboard/settings',
  },
  {
    id: 5,
    Icon: 'User2',
    disabled: false,
    type: COMMON_TYPE,
    title: 'Mon profil',
    description: 'Accéder à mon profil publique',
    href: '#',
  },
];
