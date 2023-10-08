import { isProd } from '@/constants';
import { type Session } from 'next-auth';
import { type NextRequest } from 'next/server';
import { pathToRegexp } from 'path-to-regexp';

import { type SimpleProfile } from '../api/modules/profiles';
import { createMiddleware } from './utils';

const routeGuards: RouteGuard[] = [];

addRouteGuard({
  matcher: ['/onboarding/:path*'],
  redirect: '/',
  canAccess: ({ user }) => {
    return !!user; //TODO: add to the condition the check of user Max. profiles number
  },
});

addRouteGuard({
  matcher: ['/dashboard/:path*'],
  redirect: '/',
  canAccess: ({ user, currentProfile }) => {
    return !!user && !!currentProfile;
  },
});

addRouteGuard({
  matcher: ['/testing/:path*'],
  canAccess: () => !isProd,
});

addRouteGuard({
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - onboarding (onboarding paths)
     */

    '/((?!api|_next/static|_next/image|monitoring|images|onboarding|favicon.ico).*)',
    '/',
  ],
  redirect: `/onboarding/choose-profile-type`,
  canAccess: ({ user, currentProfile, request }) => {
    if (user && user.hasBeenOnboarded === false && !currentProfile) {
      return false;
    }
    return true;
  },
});

type RouteGuard = {
  matcher: string[];
  isMatch: (pathname: string) => boolean;
  canAccess: (ctx: {
    request: NextRequest;
    user: Session['user'] | null;
    currentProfile: SimpleProfile | null;
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
