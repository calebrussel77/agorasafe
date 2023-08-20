import { createServerSideHelpers } from '@trpc/react-query/server';
import {
  type GetServerSidePropsContext,
  type GetServerSidePropsResult,
  type Redirect,
} from 'next';
import { Awaitable, type Session } from 'next-auth';
import superjson from 'superjson';

import { appRouter } from '../api/root';
import { createInnerTRPCContext } from '../api/trpc';
import { getServerAuthSession } from '../auth';

export const getServerProxySSGHelpers = async (
  ctx: GetServerSidePropsContext,
  session: Session | null
  // eslint-disable-next-line @typescript-eslint/require-await
) => {
  const ssg = createServerSideHelpers({
    router: appRouter,
    ctx: createInnerTRPCContext({ session }),
    transformer: superjson,
  });
  return ssg;
};

type AsyncReturnType<T extends (...args: any) => Promise<any>> = T extends (
  ...args: any
) => Promise<infer R>
  ? R
  : any;

export function createServerSideProps<P>({
  resolver,
  shouldUseSSG,
  shouldUseSession = false,
  prefetch = 'once',
}: CreateServerSidePropsProps<P>) {
  return async (context: GetServerSidePropsContext) => {
    const isClient = context.req.url?.startsWith('/_next/data') ?? false;
    const session =
      (context.req as never)['session'] ??
      (shouldUseSession ? await getServerAuthSession(context) : null);

    const ssg =
      shouldUseSSG && (prefetch === 'always' || !isClient)
        ? await getServerProxySSGHelpers(context, session)
        : undefined;

    const result = (await resolver({
      ctx: context,
      isClient,
      ssg,
      session,
    })) as GetPropsFnResult<P> | undefined;

    const returnedProps = result?.props as GetPropsFnResult<P>['props'];

    if (result) {
      if (result.redirect) return { redirect: result.redirect };
      if (result.notFound) return { notFound: result.notFound };
    }

    return {
      props: {
        session,
        ...returnedProps,
        ...(ssg ? { trpcState: ssg.dehydrate() } : {}),
      },
    };
  };
}

type GetPropsFnResult<P> = {
  props: P;
  redirect: Redirect;
  notFound: true;
};

type CreateServerSidePropsProps<P> = {
  shouldUseSSG?: boolean;
  shouldUseSession?: boolean;
  prefetch?: 'always' | 'once';
  resolver: (
    context: CustomGetServerSidePropsContext
  ) =>
    | Promise<GetServerSidePropsResult<P> | void>
    | GetServerSidePropsResult<P>
    | void;
};

type CustomGetServerSidePropsContext = {
  ctx: GetServerSidePropsContext;
  isClient: boolean;
  ssg?: AsyncReturnType<typeof getServerProxySSGHelpers>;
  session?: Session | null;
};
