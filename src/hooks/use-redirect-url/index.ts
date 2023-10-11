import { REDIRECT_QUERY_KEY } from '@/constants';
import { useSearchParams } from 'next/navigation';

import {
  type LoginRedirectReason,
  loginRedirectReasons,
} from '@/features/auth';

export const useRedirectUrl = (defaultRedirectUrl = '/') => {
  const searchParams = useSearchParams();
  const redirectUrl =
    searchParams.get(REDIRECT_QUERY_KEY) || defaultRedirectUrl;

  const reason = searchParams.get('reason') as LoginRedirectReason;
  const redirectReason = reason ? loginRedirectReasons[reason] : null;

  return {
    redirectUrl,
    redirectReason,
  };
};
