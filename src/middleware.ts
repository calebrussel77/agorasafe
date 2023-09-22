// middleware.ts
import { type NextRequestWithAuth, withAuth } from 'next-auth/middleware';

import { runMiddlewares } from './server/middlewares';

export default withAuth(
  // `withAuth` augments your `Request` with the user's token.
  function middleware(request: NextRequestWithAuth) {
    return runMiddlewares(request);
  },
  {
    callbacks: {
      authorized: ({ token }) => true,
    },
  }
);
