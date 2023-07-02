import { type GetServerSidePropsContext, GetServerSidePropsResult } from 'next';
import { type Session } from 'next-auth';

import { getServerAuthSession } from '@/server/auth';

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
  const redirect_url = ctx.resolvedUrl;
  const destination = `${redirectUrl}?source=${redirect_url}`;

  if (!session) {
    return {
      redirect: {
        destination: destination,
        permanent: false,
      },
    };
  }

  // if (!allowedRoles?.includes(session?.user?.role)) {
  //   return {
  //     redirect: {
  //       destination: `/`,
  //       permanent: false,
  //     },
  //   };
  // }

  return (
    cb ? cb({ session: session as unknown as Session }) : undefined
  ) as GetServerSidePropsResult<{ session: Session }>;
};
