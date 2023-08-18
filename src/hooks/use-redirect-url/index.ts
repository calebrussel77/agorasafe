import { REDIRECT_QUERY_KEY } from '@/constants';
import { type NextRouter } from 'next/router';

import {
  type LoginRedirectReason,
  loginRedirectReasons,
} from '@/features/auth';

export const useRedirectUrl = (
  router: NextRouter,
  defaultRedirectUrl = '/'
) => {
  const redirectUrl = (router.query[REDIRECT_QUERY_KEY] ||
    defaultRedirectUrl) as string;
  const reason = router.query['reason'] as LoginRedirectReason;
  const redirectReason = reason ? loginRedirectReasons[reason] : null;

  return {
    redirectUrl,
    redirectReason,
  };
};
