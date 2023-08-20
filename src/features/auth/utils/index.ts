import { REDIRECT_QUERY_KEY } from '@/constants';

import { generateUrlWithSearchParams } from '@/utils/misc';

export const loginRedirectReasons = {
  'session-expired':
    'Votre session a expiré par mesure de sécurité. Veuillez vous reconnecter pour continuer à accéder à votre compte.',
  'publish-new-service':
    'Vous devez être connecté pour publier une demande de service',
  'report-content': 'You need to be logged in to report this content',
  'report-model': 'You need to be logged in to report this model',
  'report-review': 'You need to be logged in to report this review',
  'report-article': 'You need to be logged in to report this article',
  'report-user': 'You need to be logged in to report this user',
  'create-review': 'You need to be logged in to add a review',
  'upload-model': 'You need to be logged in to upload a model',
  'favorite-model': 'You need to be logged in to like a model',
  'create-comment': 'You need to be logged in to add a comment',
  'report-comment': 'You need to be logged in to report this comment',
  'follow-user': 'You need to be logged in to follow a user',
  'follow-collection': 'You need to be logged in to follow a collection',
  'hide-content': 'You need to be logged in to hide content',
  'notify-version': 'You need to be logged in to subscribe for notifications',
  'discord-link': 'Login with Discord to link your account',
  'create-article': 'You need to be logged in to create an article',
  'favorite-article': 'You need to be logged in to like an article',
  'post-images': 'You need to be logged in to post images',
  'add-to-collection':
    'You must be logged in to add this resource to a collection',
};

export type LoginRedirectReason = keyof typeof loginRedirectReasons;

export function getLoginLink({
  redirectUrl,
  reason,
}: {
  redirectUrl?: string;
  reason?: LoginRedirectReason;
}) {
  return `${generateUrlWithSearchParams('/auth/login', {
    [REDIRECT_QUERY_KEY]:
      typeof window !== 'undefined'
        ? window.location.pathname
        : redirectUrl || '/',
    reason,
  })}`;
}
