import {
  type GetServerSidePropsContext,
  type GetServerSidePropsResult,
} from 'next';
import { type Session } from 'next-auth';

import { getServerAuthSession } from '@/server/auth';

type RedirectIfAuthProps = {
  ctx: GetServerSidePropsContext;
  redirectUrl?: string;
  cb?: ({ session }: { session: Session }) => unknown;
};

export const redirectIfAuth = async ({
  ctx,
  redirectUrl = '/',
  cb,
}: RedirectIfAuthProps) => {
  const session = await getServerAuthSession(ctx);

  if (session) {
    return {
      redirect: {
        destination: redirectUrl,
        permanent: false,
      },
    };
  }

  return (
    cb ? cb({ session: session as unknown as Session }) : undefined
  ) as GetServerSidePropsResult<{ session: Session }>;
};
