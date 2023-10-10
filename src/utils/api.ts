/**
 * This is the client-side entrypoint for your tRPC API. It is used to create the `api` object which
 * contains the Next.js App-wrapper, as well as your type-safe React Query hooks.
 *
 * We also create a few inference helpers for input and output types.
 */
import { WEBSITE_URL } from '@/constants';
import { initializeProfileStore } from '@/stores/profile-store';
import {
  TRPCClientError,
  httpBatchLink,
  httpLink,
  loggerLink,
  splitLink,
} from '@trpc/client';
import { createTRPCNext } from '@trpc/next';
import { type inferReactQueryProcedureOptions } from '@trpc/react-query';
import { type inferRouterInputs, type inferRouterOutputs } from '@trpc/server';
import { signOut } from 'next-auth/react';
import { unstable_batchedUpdates } from 'react-dom';
import superjson from 'superjson';

import { getLoginLink } from '@/features/auth';

import { type AppRouter } from '@/server/api/root';

// const getBaseUrl = () => {
//   if (typeof window !== 'undefined') return ''; // browser should use relative url
//   if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`; // SSR should use vercel url
//   return `http://localhost:${process.env.PORT ?? 3000}`; // dev SSR should use localhost
// };

const handleUnauthorizedErrorsOnClient = (error: unknown) => {
  if (typeof window === 'undefined') return false;

  if (!(error instanceof TRPCClientError)) return false;

  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  if (error.data?.code !== 'UNAUTHORIZED') return false;

  // Signout the user and redirect it to previous page
  void signOut({
    callbackUrl: getLoginLink({
      reason: 'session-expired',
    }),
    redirect: true,
  });

  //Use insatble batch to use non react function of the profile store
  unstable_batchedUpdates(() => {
    initializeProfileStore().getState().reset();
  });

  return true;
};

const url = `${WEBSITE_URL}/api/trpc`;

/** A set of type-safe react-query hooks for your tRPC API. */
export const api = createTRPCNext<AppRouter>({
  config() {
    return {
      queryClientConfig: {
        defaultOptions: {
          mutations: {
            useErrorBoundary: false,
            refetchOnWindowFocus: false,
            retry: (_, error) => {
              handleUnauthorizedErrorsOnClient(error);
              return false;
            },
          },
          queries: {
            useErrorBoundary: false,
            refetchOnWindowFocus: false,
            retry: (failureCount, error) => {
              if (handleUnauthorizedErrorsOnClient(error)) return false;
              return failureCount < 3;
            },
          },
        },
      },

      /**
       * Transformer used for data de-serialization from the server.
       *
       * @see https://trpc.io/docs/data-transformers
       */
      transformer: superjson,

      /**
       * Links used to determine request flow from client to server.
       *
       * @see https://trpc.io/docs/links
       */
      links: [
        loggerLink({
          enabled: opts =>
            process.env.NODE_ENV === 'development' ||
            (opts.direction === 'down' && opts.result instanceof Error),
        }),
        splitLink({
          condition: op => op.context.skipBatch === true,
          // when condition is true, use normal request
          true: httpLink({ url }),
          // when condition is false, use batching
          // false: httpBatchLink({ url, maxURLLength: 2083 }),
          false: httpLink({ url }), // Let's disable batching for now
        }),
        // httpBatchLink({
        //   url: `${getBaseUrl()}/api/trpc`,
        // }),
      ],
    };
  },
  /**
   * Whether tRPC should await queries when server rendering pages.
   *
   * @see https://trpc.io/docs/nextjs#ssr-boolean-default-false
   */
  ssr: false,
});

/**
 * Inference helper for inputs.
 *
 * @example type HelloInput = RouterInputs['example']['hello']
 */
export type RouterInputs = inferRouterInputs<AppRouter>;

/**
 * Inference helper for outputs.
 *
 * @example type HelloOutput = RouterOutputs['example']['hello']
 */
export type RouterOutputs = inferRouterOutputs<AppRouter>;

/**
 * Create type for React query options
 *
 * @see https://trpc.io/docs/server/infer-types#inference-helpers
 */
export type ReactQueryOptions = inferReactQueryProcedureOptions<AppRouter>;
