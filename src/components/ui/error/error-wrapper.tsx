/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { type TRPCError } from '@trpc/server';
import { type ReactNode } from 'react';
import { ErrorBoundary } from 'react-error-boundary';

import { CenterContent } from '../layout';
import { SectionError } from './section-error';

const ErrorWrapper = ({
  errorComponent,
  children,
  error,
  onRetryError,
}: {
  error: TRPCError | Error | { message: string } | undefined | null;
  errorComponent?: ReactNode;
  onRetryError?: () => void;
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
