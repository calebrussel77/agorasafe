import { env } from '@/env.mjs';
import { getInitialState } from '@/stores/profile-store/initial-state';
import { type Session } from 'next-auth';
import { getToken } from 'next-auth/jwt';
import { type NextRequest, NextResponse } from 'next/server';

import { routeGuardsMiddleware } from './route-guards.middleware';
import { type Middleware } from './utils';

// NOTE: order matters!
const middlewares: Middleware[] = [routeGuardsMiddleware];

export const middlewareMatcher = middlewares.flatMap(
  middleware => middleware.matcher
);

export async function runMiddlewares(request: NextRequest) {
  let user: Session['user'] | null = null;
  let hasToken = true;
  const redirect = (to: string) =>
    NextResponse.redirect(new URL(to, request.url));

  const initialState = getInitialState(request.headers);

  for (const middleware of middlewares) {
    if (middleware.shouldRun && !middleware.shouldRun(request)) continue;
    if (middleware.useSession && !user && hasToken) {
      const token = await getToken({
        req: request,
        secret: env.NEXTAUTH_JWT_SECRET,
      });

      if (!token) hasToken = false;
      user = token?.user as Session['user'];
    }
    const response = await middleware.handler({
      request,
      user,
      currentProfile: initialState?.profile,
      redirect,
    });
    if (response) return response;
  }

  return NextResponse.next();
}
