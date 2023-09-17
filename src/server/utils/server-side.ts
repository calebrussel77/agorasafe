import { type ProfileStore } from '@/stores/profile-store';
import { getInitialState } from '@/stores/profile-store/initial-state';
import { createServerSideHelpers } from '@trpc/react-query/server';
import {
  type GetServerSidePropsContext,
  type GetServerSidePropsResult,
  type Redirect,
} from 'next';
import { type Session } from 'next-auth';
import superjson from 'superjson';

import { type SimpleProfile } from '../api/modules/profiles';
import { appRouter } from '../api/root';
import { createInnerTRPCContext } from '../api/trpc';
import { getServerAuthSession } from '../auth';

export const getServerProxySSGHelpers = async (
  ctx: GetServerSidePropsContext,
  session: Session | null,
  profile: SimpleProfile | null
  // eslint-disable-next-line @typescript-eslint/require-await
) => {
  const ssg = createServerSideHelpers({
    router: appRouter,
    ctx: createInnerTRPCContext({ session, profile }),
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
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const session: Session | null =
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      (context.req as any)['session'] ??
      (shouldUseSession ? await getServerAuthSession(context) : null);

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const initialState: ProfileStore =
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      (context.req as any)['initialState'] ??
      getInitialState(context.req.headers);

    const ssg =
      shouldUseSSG && (prefetch === 'always' || !isClient)
        ? await getServerProxySSGHelpers(
            context,
            session,
            initialState?.profile
          )
        : undefined;

    const result = (await resolver({
      ctx: context,
      isClient,
      ssg,
      session,
      profile: initialState?.profile,
    })) as GetPropsFnResult<P> | undefined;

    const returnedProps = result?.props as GetPropsFnResult<P>['props'];

    if (result) {
      if (result.redirect) return { redirect: result.redirect };
      if (result.notFound) return { notFound: result.notFound };
    }

    return {
      props: {
        session,
        profile: initialState?.profile,
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
  profile?: SimpleProfile | null;
};
