// middleware.ts
import { type NextRequest } from 'next/server';

import { runMiddlewares } from './server/middlewares';

export function middleware(request: NextRequest) {
  return runMiddlewares(request);
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: [
    '/onboarding/:path*',
    '/add-new-profile',
    '/publish-service/:path*',

    //Testing pages
    '/testing/:path*',
  ],
  api: {
    bodyParser: {
      sizeLimit: '10mb',
    },
  },
};
