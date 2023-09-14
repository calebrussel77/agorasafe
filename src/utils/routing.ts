import { WEBSITE_URL } from '@/constants';
import type { NextRouter } from 'next/router';

const replaceStrategies = ['push', 'replace'] as const;
type ReplaceStrategy = (typeof replaceStrategies)[number];

interface HandleRouteBackParams {
  router: NextRouter;
  to?: string;
  replaceStrategy?: ReplaceStrategy;
}

export const handleRouteBack = ({
  router,
  to = '/',
  replaceStrategy = 'push',
}: HandleRouteBackParams) => {
  const requestedPath = `${window.location.protocol}//${window.location.host}${to}`;
  if (window.history.length > 2 && document.referrer === requestedPath) {
    router.back();
    return;
  }

  if (replaceStrategy === 'replace') {
    void router.replace(to);
    return;
  }

  void router.push(to);
};

export function generateUrlWithSearchParams(
  baseURL: string,
  params: Record<string, string | number | boolean | null | undefined>
): string {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value != null) {
      searchParams.append(key, value.toString());
    }
  });

  const url = new URL(baseURL, WEBSITE_URL);
  url.search = searchParams.toString();

  return url.href;
}

/**
 * @example
 * ```ts
 *  1. isPathMatchRoute(`/account`, `/account?name=tian#/hash`) ==> true
 *  2. isPathMatchRoute(`/account`, `/account/?name=tian#/hash`) ==> false
 * ```
 *  @param href `/account?name=tian#/hash`
 * @param asPath? useRouter().asPath `/account`
 * @returns boolean
 */
export const isPathMatchRoute = (href: string, asPath?: string) => {
  let _asPath = asPath || '';

  if (typeof window !== 'undefined') {
    _asPath = asPath || window.location.pathname;
  }

  const pathNameRegexp = /[^?#]*/;
  const asPathName = pathNameRegexp.exec(_asPath);
  const hrefPathName = pathNameRegexp.exec(href);
  if (!asPathName || !hrefPathName) {
    return false;
  }
  return asPathName[0] === hrefPathName[0];
};