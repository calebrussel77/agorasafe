import { getInitialState } from '@/stores/profile-store/initial-state';
import { createServerSideHelpers } from '@trpc/react-query/server';
import {
  type GetServerSidePropsContext,
  type GetServerSidePropsResult,
  type Redirect,
} from 'next';
import { type Session } from 'next-auth';
import superjson from 'superjson';

import { sentryCaptureException } from '@/lib/sentry';

import { type SimpleProfile } from '../api/modules/profiles';
import { appRouter } from '../api/root';
import { getServerAuthSession } from '../auth';
import { Tracker } from './tracker';

export const getServerProxySSGHelpers = (
  ctx: GetServerSidePropsContext,
  session: Session | null,
  profile: SimpleProfile | null
) => {
  const router = appRouter;
  const transformer = superjson;

  const ssg = createServerSideHelpers({
    router,
    ctx: {
      track: new Tracker(),
      user: session?.user,
      profile: profile,
      ip: null as never,
      res: null as never,
      cache: null as never,
    },
    transformer,
  });

  return ssg;
};

export const createServerSideProps = <P>({
  resolver,
  shouldUseSSG,
  shouldUseSession = false,
  prefetch = 'once',
}: CreateServerSidePropsProps<P>) => {
  return async (context: GetServerSidePropsContext) => {
    try {
      const isClient = context.req.url?.startsWith('/_next/data') ?? false;
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const session: Session | null =
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        (context.req as any)['session'] ??
        (shouldUseSession ? await getServerAuthSession(context) : null);

      const initialState = getInitialState(context.req.headers);

      const ssg =
        shouldUseSSG && (prefetch === 'always' || !isClient)
          ? getServerProxySSGHelpers(context, session, initialState?.profile)
          : undefined;

      const result = (await resolver({
        ctx: context,
        isClient,
        ssg,
        session,
        profile: initialState?.profile,
      })) as GetPropsFnResult<P> | undefined;

      let props: GetPropsFnResult<P>['props'] | undefined;

      if (result) {
        if (result.redirect) return { redirect: result.redirect };
        if (result.notFound) return { notFound: result.notFound };

        props = result.props;
      }

      return {
        props: {
          session,
          profile: initialState?.profile,
          ...((props as unknown as P) ?? ({} as unknown as P)),
          ...(ssg ? { trpcState: ssg.dehydrate() } : {}),
        },
      };
    } catch (error) {
      // good place to handle global errors
      sentryCaptureException(error);
      return { notFound: true };
    }
  };
};

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
  ssg?: ReturnType<typeof getServerProxySSGHelpers>;
  session?: Session | null;
  profile?: SimpleProfile | null;
};
