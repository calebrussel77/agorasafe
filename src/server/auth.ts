import { env } from '@/env.mjs';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
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
    };
  }

  interface User {
    // ...other properties
    fullName: string;
    picture: string;
    hasBeenOnboarded: boolean;
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
    jwt({ token, user, trigger, session }) {
      if (trigger === 'update' && session) {
        const _session = session as Session;
        token.user = _session.user;
      }
      if ((trigger === 'signIn' || trigger === 'signUp') && user) {
        token.user = {
          id: user?.id,
          email: user?.email,
          name: user?.fullName,
          avatar: user?.picture,
          hasBeenOnboarded: user?.hasBeenOnboarded,
        };
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
          hasBeenOnboarded: false,
        };
      },
    }),
  ],
  session: {
    // Set the duration time of a session to 24 hours
    maxAge: 60 * 60 * 24,
    strategy: 'jwt',
  },
  pages: {
    signIn: '/auth/login',
    error: '/auth/login',
  },
  debug: true,
  logger: {
    error(code, ...message) {
      console.error(code, message);
      sentryCaptureException({ code, message });
    },
    warn(code, ...message) {
      sentryCaptureException({ code, message });
    },
    debug(code, ...message) {
      console.log(code, message);
    },
  },
  jwt: {
    // Set the duration time of a JWT to 24 hours
    maxAge: 60 * 60 * 24,
    secret: env.NEXTAUTH_JWT_SECRET,
  },
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
