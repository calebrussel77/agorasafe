import { env } from '@/env.mjs';
import { getInitialState } from '@/stores/profile-store/initial-state';
import { type Session } from 'next-auth';
import { getToken } from 'next-auth/jwt';
import { type NextRequestWithAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

import { routeGuardsMiddleware } from './route-guards.middleware';
import { type Middleware } from './utils';

// NOTE: order matters!
const middlewares: Middleware[] = [routeGuardsMiddleware];

export const middlewareMatcher = middlewares.flatMap(
  middleware => middleware.matcher
);

export async function runMiddlewares(request: NextRequestWithAuth) {
  const redirect = (to: string) =>
    NextResponse.redirect(new URL(to, request.url));

  const initialState = getInitialState(request.headers);
  const token = request?.nextauth?.token || null;

  console.log({ token }, 'FROM GET TOKEN');
  console.log(request?.nextauth, 'FROM GET TOKEN');

  for (const middleware of middlewares) {
    if (middleware.shouldRun && !middleware.shouldRun(request)) continue;

    const response = await middleware.handler({
      request,
      user: token && token?.user ? (token?.user as Session['user']) : null,
      currentProfile: initialState?.profile,
      redirect,
    });
    if (response) return response;
  }

  return NextResponse.next();
}
