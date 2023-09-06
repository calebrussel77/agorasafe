import { isProd } from '@/constants';
import { type Session } from 'next-auth';
import { type NextRequest } from 'next/server';
import { pathToRegexp } from 'path-to-regexp';

import { type CurrentProfile } from '@/features/profiles';

import { createMiddleware } from './utils';

const routeGuards: RouteGuard[] = [];

addRouteGuard({
  matcher: [
    '/onboarding/:path*',
    '/add-new-profile',
    '/publish-service/:path*',
  ],
  canAccess: ({ user }) => {
    return !!user;
  },
});

addRouteGuard({
  matcher: ['/testing/:path*'],
  canAccess: () => !isProd,
});

//#region Logic
type RouteGuard = {
  matcher: string[];
  isMatch: (pathname: string) => boolean;
  canAccess: (ctx: {
    request: NextRequest;
    user: Session['user'] | null;
    currentProfile: CurrentProfile;
  }) => boolean | undefined;
  redirect?: string;
};

function addRouteGuard(routeGuard: Omit<RouteGuard, 'isMatch'>) {
  const regexps = routeGuard.matcher.map(m => pathToRegexp(m));
  const isMatch = (pathname: string) =>
    regexps.some(r => {
      return r.test(pathname);
    });

  return routeGuards.push({
    ...routeGuard,
    isMatch,
  });
}

export const routeGuardsMiddleware = createMiddleware({
  matcher: routeGuards.flatMap(routeGuard => routeGuard.matcher),
  useSession: true,
  handler: ({ currentProfile, user, request, redirect }) => {
    const { pathname } = request.nextUrl;

    for (const routeGuard of routeGuards) {
      if (!routeGuard.isMatch(pathname)) continue;
      if (routeGuard.canAccess({ user, request, currentProfile })) continue;

      // Can't access, redirect to login
      return redirect(
        routeGuard.redirect ?? `/auth/login?returnUrl=${pathname}`
      );
    }
  },
});

//#endregion
