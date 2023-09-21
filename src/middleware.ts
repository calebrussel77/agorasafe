// middleware.ts
import { type NextRequest } from 'next/server';

import { runMiddlewares } from './server/middlewares';

export function middleware(request: NextRequest) {
  return runMiddlewares(request);
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */

    '/((?!api|_next/static|_next/image|favicon.ico).*)',
    '/',
  ],
};
