/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { type TRPCError } from '@trpc/server';
import { type ReactNode } from 'react';
import { ErrorBoundary } from 'react-error-boundary';

import { CenterContent } from '../layout';
import { SectionError } from './section-error';

/**
 * Renders an error wrapper component that displays an error message or an error component if an error occurs.
 *
 * @param {object} props - The props object containing the following properties:
 *   - error: The error object to display. It can be of type TRPCError, Error, { message: string }, undefined, or null.
 *   - errorComponent: (optional) The React component to render when an error occurs.
 *   - onRetryError: (optional) A callback function to retry the error.
 *   - children: The React nodes to render if there is no error.
 * @return {ReactNode} The rendered error wrapper component.
 */
const ErrorWrapper = ({
  errorComponent,
  children,
  error,
  onRetryError,
}: {
  error: TRPCError | Error | { message: string } | undefined | null;
  errorComponent?: ReactNode;
  onRetryError?: () => Promise<unknown> | void;
  children: ReactNode;
}) => {
  return (
    <ErrorBoundary
      FallbackComponent={({ error }) => (
        <CenterContent>
          <SectionError error={error} />
        </CenterContent>
      )}
    >
      {error ? (
        <>
          {errorComponent ? (
            errorComponent
          ) : (
            <CenterContent>
              <SectionError error={error} onRetry={onRetryError} />
            </CenterContent>
          )}
        </>
      ) : (
        children
      )}
    </ErrorBoundary>
  );
};

export { ErrorWrapper };
