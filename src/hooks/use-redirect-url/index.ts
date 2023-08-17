import { REDIRECT_QUERY_KEY } from '@/constants';
import { type NextRouter } from 'next/router';

export const useRedirectUrl = (
  router: NextRouter,
  defaultRedirectUrl = '/'
) => {
  const redirectUrl = (router.query[REDIRECT_QUERY_KEY] ||
    defaultRedirectUrl) as string;
  const redirectReason = (router.query['reason'] || null) as string | null;

  return {
    redirectUrl,
    redirectReason,
  };
};
