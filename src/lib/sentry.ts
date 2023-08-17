import * as Sentry from '@sentry/nextjs';
import { type TRPC_ERROR_CODE_KEY } from '@trpc/server/rpc';
import { type NextPageContext } from 'next';

export const ALLOWED_SENTRY_EXCEPTION_CODE_REPORTS: TRPC_ERROR_CODE_KEY[] = [
  'INTERNAL_SERVER_ERROR',
  'TOO_MANY_REQUESTS',
  'TIMEOUT',
];

export const sentryCaptureException = (error: unknown) =>
  Sentry.captureException(error);

export const sentryCaptureUnderscoreErrorException = async (
  contextData: NextPageContext
) => {
  // In case this is running in a serverless function, await this in order to give Sentry
  // time to send the error before the lambda exits
  await Sentry.captureUnderscoreErrorException(contextData);
};
