import { SESSION_VERSION } from '@/constants';
import { env } from '@/env.mjs';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import { type Role } from '@prisma/client';
import { type GetServerSidePropsContext } from 'next';
import {
  type DefaultSession,
  type NextAuthOptions,
  type Session,
  getServerSession,
} from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';

import { makeRandomId } from '@/utils/misc';

import { sentryCaptureException } from '@/lib/sentry';

import { prisma } from '@/server/db';

import { getUserByEmail } from './api/modules/users';
import { throwDbError, throwNotFoundError } from './utils/error-handling';

/**
 * Module augmentation for `next-auth` types. Allows us to add custom properties to the `session`
 * object and keep type safety.
 *
 * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
 */

declare module 'next-auth' {
  interface Session extends DefaultSession {
    user: {
      id: string;
      name: string;
      email: string;
      avatar: string;
      hasBeenOnboarded: boolean;
      role: Role;
    };
    version: number;
  }

  interface User {
    // ...other properties
    fullName: string;
    picture: string;
  }
}

/**
 * Options for NextAuth.js used to configure adapters, providers, callbacks, etc.
 *
 * @see https://next-auth.js.org/configuration/options
 */
export const authOptions: NextAuthOptions = {
  callbacks: {
    session: ({ session, token }) => {
      session.user = (
        token.user ? token.user : session.user
      ) as Session['user'];
      session.version = (
        token.version ? token.version : session.version
      ) as Session['version'];

      return { ...session };
    },
    async jwt({ token, user, trigger, session }) {
      if (trigger === 'update' && session) {
        const _session = session as Session;
        token.user = _session.user;
        token.version = SESSION_VERSION;
      } else {
        if (user) {
          try {
            const _user = await getUserByEmail(user?.email as string);

            if (!_user) throwNotFoundError();

            token.user = {
              id: user?.id,
              email: user?.email,
              name: user?.fullName,
              avatar: user?.picture,
              hasBeenOnboarded: _user.hasBeenOnboarded,
              role: _user.role,
            };

            token.version = SESSION_VERSION;
          } catch (e) {
            throwDbError(e);
          }
        }
      }
      return token;
    },
  },
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      allowDangerousEmailAccountLinking: true,
      httpOptions: {
        timeout: 20_000,
      },
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
      profile(profile: {
        name: string;
        given_name: string;
        family_name: string;
        picture: string;
        email: string;
      }) {
        return {
          id: makeRandomId(),
          firstName: profile.given_name,
          lastName: profile.family_name,
          email: profile?.email,
          picture: profile?.picture,
          fullName: `${profile.given_name} ${profile.family_name}`,
        };
      },
    }),
  ],
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  pages: {
    signIn: '/auth/login',
    error: '/auth/login',
  },
  debug: true,
  logger: {
    error(code, ...message) {
      sentryCaptureException({ code, message });
    },
    warn(code, ...message) {
      sentryCaptureException({ code, message });
    },
  },
  jwt: {
    maxAge: 30 * 24 * 60 * 60, // 30 days
    secret: env.NEXTAUTH_JWT_SECRET,
  },
  secret: env.NEXTAUTH_SECRET,
};

/**
 * Wrapper for `getServerSession` so that you don't need to import the `authOptions` in every file.
 *
 * @see https://next-auth.js.org/configuration/nextjs
 */
export const getServerAuthSession = (ctx: {
  req: GetServerSidePropsContext['req'];
  res: GetServerSidePropsContext['res'];
}) => {
  return getServerSession(ctx.req, ctx.res, authOptions);
};
