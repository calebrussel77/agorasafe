/**
 * YOU PROBABLY DON'T NEED TO EDIT THIS FILE, UNLESS:
 * 1. You want to modify request context (see Part 1).
 * 2. You want to create a new middleware or type of procedure (see Part 3).
 *
 * TL;DR - This is where all the tRPC server stuff is created and plugged in. The pieces you will
 * need to use are documented accordingly near the end.
 */
import { sessionVersion } from '@/constants';
import { TRPCError, initTRPC } from '@trpc/server';
import { type Session } from 'next-auth';
import superjson from 'superjson';

import { prisma } from '@/server/db';

import { throwForbiddenError } from '../utils/error-handling';
import { type Context } from './create-context';
import { type SimpleProfile } from './modules/profiles';

/**
 * 1. CONTEXT
 *
 * This section defines the "contexts" that are available in the backend API.
 *
 * These allow you to access things when processing a request, like the database, the session, etc.
 */

type CreateContextOptions = {
  session: Session | null;
  profile: SimpleProfile | null;
};

/**
 * This helper generates the "internals" for a tRPC context. If you need to use it, you can export
 * it from here.
 *
 * Examples of things you may need it for:
 * - testing, so we don't have to mock Next.js' req/res
 * - tRPC's `createSSGHelpers`, where we don't have req/res
 *
 * @see https://create.t3.gg/en/usage/trpc#-serverapitrpcts
 */
export const createInnerTRPCContext = (opts: CreateContextOptions) => {
  return {
    session: opts.session,
    profile: opts.profile,
    prisma,
  };
};

/**
 * 2. INITIALIZATION
 *
 * This is where the tRPC API is initialized, connecting the context and transformer. We also parse
 * ZodErrors so that you get typesafety on the frontend if your procedure fails due to validation
 * errors on the backend.
 */

const t = initTRPC.context<Context>().create({
  transformer: superjson,
  errorFormatter({ shape }) {
    return shape;
  },
});

/**
 * 3. ROUTER & PROCEDURE (THE IMPORTANT BIT)
 *
 * These are the pieces you use to build your tRPC API. You should import these a lot in the
 * "/src/server/api/routers" directory.
 */

/**
 * This is how you create new routers and sub-routers in your tRPC API.
 *
 * @see https://trpc.io/docs/router
 */
export const createTRPCRouter = t.router;

/**
 * Public (unauthenticated) procedure
 *
 * This is the base piece you use to build new queries and mutations on your tRPC API. It does not
 * guarantee that a user querying is authorized, but you can still access user session data if they
 * are logged in.
 */
export const publicProcedure = t.procedure;

export const { router, middleware } = t;

/**
 * Protected procedure
 **/

const isAuthed = t.middleware(({ ctx: { user, profile }, next }) => {
  if (!user) {
    throw new TRPCError({ code: 'UNAUTHORIZED' });
  }

  if (user.version !== sessionVersion) {
    throw new TRPCError({ code: 'UNAUTHORIZED' });
  }

  return next({
    ctx: { user, profile },
  });
});

const isMuted = t.middleware(({ ctx: { user, profile }, next }) => {
  if (!user || !profile) {
    throw new TRPCError({ code: 'UNAUTHORIZED' });
  }

  if (user.version !== sessionVersion) {
    throw new TRPCError({ code: 'UNAUTHORIZED' });
  }

  if (profile.isMuted)
    throw new TRPCError({
      code: 'FORBIDDEN',
      message:
        'Vous ne pouvez pas effectuer cette action car votre compte à été banni.',
    });

  return next({
    ctx: { user, profile },
  });
});

const isAdmin = t.middleware(({ ctx: { user, profile }, next }) => {
  if (!user || !profile) {
    throw new TRPCError({ code: 'UNAUTHORIZED' });
  }

  if (user.version !== sessionVersion) {
    throw new TRPCError({ code: 'UNAUTHORIZED' });
  }

  if (user.role !== 'ADMIN')
    throw new TRPCError({
      code: 'FORBIDDEN',
      message: "Vous n'avez pas la permission d'effectuer cette action",
    });

  return next({
    ctx: { user, profile },
  });
});

const hasProfile = t.middleware(({ ctx: { user, profile }, next }) => {
  if (!user || !profile) {
    throw new TRPCError({ code: 'UNAUTHORIZED' });
  }

  if (user.version !== sessionVersion) {
    throw new TRPCError({ code: 'UNAUTHORIZED' });
  }

  if (profile.bannedAt)
    throw new TRPCError({
      code: 'FORBIDDEN',
      message:
        'Vous ne pouvez pas effectuer cette action car votre profile à été banni.',
    });

  return next({
    ctx: { user, profile },
  });
});

const isCustomer = t.middleware(({ ctx: { user, profile }, next }) => {
  if (!user || !profile) {
    throw new TRPCError({ code: 'UNAUTHORIZED' });
  }

  if (user.version !== sessionVersion) {
    throw new TRPCError({ code: 'UNAUTHORIZED' });
  }

  if (profile.type !== 'CUSTOMER') {
    throwForbiddenError();
  }

  return next({
    ctx: { user, profile },
  });
});

const isProvider = t.middleware(({ ctx: { profile, user }, next }) => {
  if (!user || !profile) {
    throw new TRPCError({ code: 'UNAUTHORIZED' });
  }

  if (user.version !== sessionVersion) {
    throw new TRPCError({ code: 'UNAUTHORIZED' });
  }

  if (profile?.type !== 'PROVIDER') {
    throwForbiddenError();
  }

  return next({
    ctx: { user, profile },
  });
});

/**
 * Protected Procedure used when the user is connected
 * but `does'nt have a profile selected`
 **/
export const protectedProcedure = publicProcedure.use(isAuthed);

/**
 * Protected Procedure used when the user is connected
 * and have a `profile selected` (could be any type of profiles)
 **/
export const profileProcedure = publicProcedure.use(hasProfile);

/**
 * Protected Procedure used when the user is connected
 * with `Provider profile`
 **/
export const providerProcedure = protectedProcedure.use(isProvider);

/**
 * Protected Procedure used when the user is connected
 * with `Customer profile`
 **/
export const customerProcedure = protectedProcedure.use(isCustomer);

/**
 * Guarded procedure to prevent users from making actions
 * based on `muted/banned properties`
 */
export const guardedProcedure = protectedProcedure.use(isMuted);

/**
 * Admin Protected procedure
 **/
export const adminProcedure = protectedProcedure.use(isAdmin);
