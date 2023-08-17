import { REDIRECT_QUERY_KEY } from '@/constants';
import {
  type GetServerSidePropsContext,
  type GetServerSidePropsResult,
} from 'next';
import { type Session } from 'next-auth';

import { getServerAuthSession } from '@/server/auth';

import { generateUrlWithSearchParams } from './misc';

type RequireAuthProps = {
  ctx: GetServerSidePropsContext;
  redirectUrl?: string;
  cb?: ({ session }: { session: Session }) => unknown;
  allowedRoles?: Array<string>;
};

export const requireAuth = async ({
  ctx,
  redirectUrl = '/auth/login',
  cb,
}: RequireAuthProps) => {
  const session = await getServerAuthSession(ctx);
  const _redirectUrl = ctx.resolvedUrl;
  const destination = generateUrlWithSearchParams(redirectUrl, {
    [REDIRECT_QUERY_KEY]: _redirectUrl,
  });

  if (!session) {
    return {
      redirect: {
        destination: destination,
        permanent: false,
      },
    };
  }

  return (
    cb ? cb({ session: session as unknown as Session }) : undefined
  ) as GetServerSidePropsResult<{ session: Session }>;
};
