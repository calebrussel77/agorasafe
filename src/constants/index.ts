import { ProfileType } from '@prisma/client';

import { env } from '../env.mjs';
import { isWindowDefined } from '../utils/type-guards';

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

export const sessionVersion = Number(process.env.NEXT_PUBLIC_SESSION_VERSION);

export const profileVersion = Number(process.env.NEXT_PUBLIC_profileVersion);

export const WEBSITE_URL = getWebsiteUrl();

export const APP_NAME = env.NEXT_PUBLIC_APP_NAME || 'Agorasafe.com';

export const USER_PROFILES_LIMIT_COUNT = 2;

export const COMMON_PROFILE_TYPE = 'COMMON';

export const REDIRECT_QUERY_KEY = 'redirectUrl';

export const profilesDescription: Record<
  ProfileType,
  { label: string; description: string }
> = {
  [ProfileType.PROVIDER]: {
    label: 'Prestataire',
    description: `Je souhaite vendre mes services auprès des clients de la plateforme.`,
  },
  [ProfileType.CUSTOMER]: {
    label: 'Client',
    description: `Je souhaite créer des démandes de services et payer des personnes capables de satisfaire mes besoins.`,
  },
};
