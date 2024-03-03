import { ProfileType } from '@prisma/client';

import { extractDomainName } from '@/utils/strings';

import { buildGenericOgImageUrl } from '@/lib/og-images';

import { env } from '../env.mjs';

export const OG_WIDTH = 1200;

export const OG_HEIGHT = 630;

export const SOCKET_API_BASE_URL = '/api/socket';

export const SOCKET_IO_PATH = `${SOCKET_API_BASE_URL}/io`;

export const isDev = process.env.NODE_ENV === 'development';

export const isProd = process.env.NODE_ENV === 'production';

export const isMaintenanceMode = process.env.MAINTENANCE_MODE === 'true';

export const sessionVersion = Number(process.env.NEXT_PUBLIC_SESSION_VERSION);

export const profileVersion = Number(process.env.NEXT_PUBLIC_profileVersion);

export const APP_URL = env.NEXT_PUBLIC_APP_URL;

export const APP_NAME = env.NEXT_PUBLIC_APP_NAME || 'Agorasafe.com';

export const USER_PROFILES_LIMIT_COUNT = 2;

export const COMMON_PROFILE_TYPE = 'COMMON';

export const REDIRECT_QUERY_KEY = 'redirectUrl';

export const DEFAULT_APP_TITLE = `Agorasafe - Connectez vos besoins aux meilleurs talents de votre région`;

export const DEFAULT_AVATAR_URL = `${APP_URL}/images/avatar.svg`;

export const DEFAULT_APP_IMAGE = buildGenericOgImageUrl({
  title: DEFAULT_APP_TITLE,
  url: extractDomainName(APP_URL),
});

export const DEFAULT_APP_DESCRIPTION =
  'Trouvez les talents dont vous avez besoin pour répondre à vos besoins, ou proposez vos compétences pour aider les autres. Réunissez vos besoins avec les talents locaux sur notre plateforme de mise en relation. La clé pour transformer vos idées en réalité';

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

export const appPrimaryColor = '#354cd0';
