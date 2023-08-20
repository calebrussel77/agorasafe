import { type Session } from 'next-auth';
import { type NextRequest, type NextResponse } from 'next/server';

import { type CurrentProfile } from '@/features/profiles';

export type Middleware = {
  matcher: string[];
  useSession?: boolean;
  shouldRun?: (request: NextRequest) => boolean;
  handler: (ctx: {
    request: NextRequest;
    user: Session['user'] | null;
    currentProfile: CurrentProfile;
    redirect: (to: string) => NextResponse;
  }) => Promise<NextResponse | void>;
};

export function createMiddleware(middleware: Middleware) {
  if (!middleware.shouldRun) {
    const matcherBases = middleware.matcher.map(m => m.split(':')[0]);
    middleware.shouldRun = ({ nextUrl }) =>
      matcherBases.some(m => (m ? nextUrl.pathname.startsWith(m) : null));
  }
  return middleware;
}
