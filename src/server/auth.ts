import { env } from '@/env.mjs';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import { type GetServerSidePropsContext } from 'next';
import {
  type DefaultSession,
  type NextAuthOptions,
  getServerSession,
} from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';

import { makeRandomId } from '@/utils/misc';

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
    };
  }

  interface User {
    // ...other properties
    full_name: string;
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
      session.user = {
        id: token.id as string,
        name: token.name as string,
        email: token.email as string,
        avatar: token.avatar as string,
      };
      return Promise.resolve(session);
    },
    jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user?.email;
        token.name = user?.full_name;
        token.avatar = user.picture;
      }
      return Promise.resolve(token);
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
          first_name: profile.given_name,
          last_name: profile.family_name,
          email: profile?.email,
          picture: profile?.picture,
          full_name: `${profile.given_name} ${profile.family_name}`,
        };
      },
    }),
  ],
  session: {
    strategy: 'jwt',
  },
  pages: {
    signIn: '/auth/login',
    error: '/auth/login',
  },
  debug: env.NODE_ENV === 'development',
  jwt: {
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
