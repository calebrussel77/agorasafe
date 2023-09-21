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

    '/((?!api|_next/static|_next/image|onboarding|favicon.ico).*)',
    '/fr/((?!api|_next/static|_next/image|onboarding|favicon.ico).*)',
    '/en/((?!api|_next/static|_next/image|onboarding|favicon.ico).*)',
    '/',
    '/fr',
    '/en',
  ],
  redirect: `/onboarding/choose-profile-type`,
  canAccess: ({ user, currentProfile, request }) => {
    console.log({ user }, 'From Middleware');
    console.log({ currentProfile }, 'From Middleware');
    console.log(request?.url, 'URL From Middleware');

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

    console.log({ user }, 'From routeGuardsMiddleware called');

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
