/**
 * NOTE: This requires `@sentry/nextjs` version 7.3.0 or higher.
 *
 * This page is loaded by Nextjs:
 *  - on the server, when data-fetching methods throw or reject
 *  - on the client, when `getInitialProps` throws or rejects
 *  - on the client, when a React lifecycle method throws or rejects, and it's
 *    caught by the built-in Nextjs error boundary
 *
 * See:
 *  - https://nextjs.org/docs/basic-features/data-fetching/overview
 *  - https://nextjs.org/docs/api-reference/data-fetching/get-initial-props
 *  - https://reactjs.org/docs/error-boundaries.html
 */
import { APP_NAME } from '@/constants';
import type { NextPage } from 'next';
import type { ErrorProps } from 'next/error';
import NextErrorComponent from 'next/error';

import { sentryCaptureUnderscoreErrorException } from '@/lib/sentry';

const CustomErrorComponent: NextPage<ErrorProps> & {
  shouldDisableAnalytics: boolean;
} = props => {
  // If you're using a Nextjs version prior to 12.2.1, uncomment this to
  // compensate for https://github.com/vercel/next.js/issues/8592
  // Sentry.captureUnderscoreErrorException(props);
  return (
    <NextErrorComponent
      statusCode={props.statusCode}
      title={`Une erreur est surevenue | ${APP_NAME}`}
    />
  );
};

CustomErrorComponent.getInitialProps = async contextData => {
  await sentryCaptureUnderscoreErrorException(contextData);

  // This will contain the status code of the response
  return NextErrorComponent.getInitialProps(contextData);
};

CustomErrorComponent.shouldDisableAnalytics = true;

export default CustomErrorComponent;
