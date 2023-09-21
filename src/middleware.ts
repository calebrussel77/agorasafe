// middleware.ts
import { withAuth } from 'next-auth/middleware';

// import { type NextRequest } from 'next/server';
import { runMiddlewares } from './server/middlewares';

export default withAuth(
  // `withAuth` augments your `Request` with the user's token.
  function middleware(req) {
    return runMiddlewares(req);
  },
  {
    callbacks: {
      authorized: ({ token }) => true,
    },
  }
);
