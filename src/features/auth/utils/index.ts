import { REDIRECT_QUERY_KEY } from '@/constants';

import { isWindowDefined } from '@/utils/type-guards';

import { QS } from '@/lib/qs';

export const loginRedirectReasons = {
  'session-expired':
    'Votre session a expiré par mesure de sécurité. Veuillez vous reconnecter pour continuer à accéder à votre compte.',
  'create-service-request':
    'Vous devez être connecté pour créer une demande de service',
  'make-service-request-offer':
    'Vous devez être connecté pour faire votre offre.',
  'create-comment': 'Connectez-vous pour faire votre commentaire.',
  'send-message': 'Vous devez être connecté envoyer un message.',
};

export type LoginRedirectReason = keyof typeof loginRedirectReasons;

export function getLoginLink({
  redirectUrl,
  reason,
}: {
  redirectUrl?: string;
  reason?: LoginRedirectReason;
}) {
  return `/auth/login?${QS.stringify({
    [REDIRECT_QUERY_KEY]: isWindowDefined()
      ? window.location.pathname
      : redirectUrl || '/',
    reason,
  })}`;
}
