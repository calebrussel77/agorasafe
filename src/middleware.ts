// middleware.ts
import { type NextRequest } from 'next/server';

import { runMiddlewares } from './server/middlewares';

export function middleware(request: NextRequest) {
  return runMiddlewares(request);
}
