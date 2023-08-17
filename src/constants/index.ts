import { env } from '@/env.mjs';
import { ProfileType } from '@prisma/client';

const VERCEL_URL = process.env.NEXT_PUBLIC_VERCEL_URL
  ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`
  : '';

export const WEBSITE_URL =
  env.NEXT_PUBLIC_APP_URL || VERCEL_URL || 'http://localhost:3000';

export const APP_NAME = env.NEXT_PUBLIC_APP_NAME || 'Agorasafe.com';

export const USER_PROFILES_LIMIT_COUNT = 2;

export const COMMON_PROFILE_TYPE = 'COMMON';

export const REDIRECT_QUERY_KEY = 'redirect_uri';

export const APP_PROFILES_INFO = [
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

export const APP_PROFILE_LINKS = [
  {
    id: 1,
    iconUrl: '/icons/home.svg',
    disabled: false,
    type: COMMON_PROFILE_TYPE,
    title: 'Tableau de bord',
    description: 'Accéder à mon tableau de bord personnel',
    href: '/dashboard',
  },
  {
    id: 2,
    iconUrl: '/icons/clipboard-signature.svg',
    disabled: false,
    type: ProfileType.CUSTOMER,
    title: 'Mes demandes',
    description: 'Consulter mes demandes de service',
    href: '/dashboard/my-requests',
  },
  {
    id: 3,
    iconUrl: '/icons/messages-square.svg',
    disabled: false,
    type: COMMON_PROFILE_TYPE,
    title: 'Conversations',
    description: 'Consulter mes messages inbox',
    href: '/dashboard/inbox',
  },
  {
    id: 4,
    iconUrl: '/icons/clipboard-paste.svg',
    disabled: false,
    title: 'Services postulés',
    type: ProfileType.PROVIDER,
    description: "Accéder aux services auxquels j'ai postulé",
    href: '/dashboard/applied-services',
  },
  {
    id: 6,
    iconUrl: '/icons/settings.svg',
    disabled: false,
    type: COMMON_PROFILE_TYPE,
    title: 'Paramètres',
    description: 'Gérer mes paramètres utilisateur',
    href: '/dashboard/settings',
  },
  {
    id: 5,
    iconUrl: '/icons/user.svg',
    disabled: false,
    type: COMMON_PROFILE_TYPE,
    title: 'Mon profil',
    description: 'Accéder à mon profil publique',
    href: '#',
  },
];
