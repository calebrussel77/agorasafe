import { REDIRECT_QUERY_KEY } from '@/constants';
import { useRouter } from 'next/router';

import {
  type LoginRedirectReason,
  loginRedirectReasons,
} from '@/features/auth';

export const useRedirectUrl = (defaultRedirectUrl = '/') => {
  const { query } = useRouter();
  const redirectUrl =
    (query[REDIRECT_QUERY_KEY] as string) || defaultRedirectUrl;
  const reason = query?.reason as LoginRedirectReason;

  const redirectReason = reason ? loginRedirectReasons[reason] : null;

  return {
    redirectUrl,
    redirectReason,
  };
};
