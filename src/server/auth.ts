import { sessionVersion } from '@/constants';
import { env } from '@/env.mjs';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import { type Role, User } from '@prisma/client';
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

import { getSessionUser } from './api/modules/users';

/**
 * Module augmentation for `next-auth` types. Allows us to add custom properties to the `session`
 * object and keep type safety.
 *
 * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
 */

declare module 'next-auth' {
  interface Session extends DefaultSession {
    user: AsyncReturnType<typeof getSessionUser>;
  }

  interface User {
    // ...other properties
    fullName: string;
    version: number;
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

      return session;
    },
    async jwt({ token, user, trigger }) {
      if (trigger === 'update') {
        const userFound = await getSessionUser({ userId: token.sub });
        token.user = userFound;
      } else {
        if (user) {
          const userFound = await getSessionUser({ userId: token.sub });
          token.user = userFound;
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
          version: sessionVersion,
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
  debug: false,
  logger: {
    error(code, ...message) {
      sentryCaptureException({ code, message });
    },
    warn(code, ...message) {
      sentryCaptureException({ code, message });
    },
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
