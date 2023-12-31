import { env } from '@/env.mjs';
import { ProfileType } from '@prisma/client';

import { isWindowDefined } from '@/utils/type-guards';

const getWebsiteUrl = () => {
  if (isDev) return 'http://localhost:3000';

  if (env.NEXT_PUBLIC_APP_URL) return env.NEXT_PUBLIC_APP_URL;

  if (isWindowDefined()) return window.location.origin;

  return 'https://agorasafe-test.up.railway.app';
};

export const SOCKET_API_BASE_URL = '/api/socket';

export const SOCKET_IO_PATH = `${SOCKET_API_BASE_URL}/io`;

export const isDev = process.env.NODE_ENV === 'development';

export const isProd = process.env.NODE_ENV === 'production';

export const isMaintenanceMode = process.env.MAINTENANCE_MODE === 'true';

export const SESSION_VERSION = Number(process.env.NEXT_PUBLIC_SESSION_VERSION);

export const PROFILE_VERSION = Number(process.env.NEXT_PUBLIC_PROFILE_VERSION);

export const WEBSITE_URL = getWebsiteUrl();

export const APP_NAME = env.NEXT_PUBLIC_APP_NAME || 'Agorasafe.com';

export const USER_PROFILES_LIMIT_COUNT = 2;

export const COMMON_PROFILE_TYPE = 'COMMON';

export const REDIRECT_QUERY_KEY = 'redirectUrl';

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
