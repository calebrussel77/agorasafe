import { type TRPCError } from '@trpc/server';
import React, { type FC, type ReactElement, type ReactNode } from 'react';

import { ErrorWrapper } from '@/components/ui/error';
import { CenterContent } from '@/components/ui/layout';
import { Spinner } from '@/components/ui/spinner';

interface AsyncWrapperProps {
  children: ReactNode;
  isLoading: boolean;
  loader?: ReactElement | JSX.Element;
  error: TRPCError | Error | { message: string } | undefined | null;
  onRetryError?: () => void;
}
const AsyncWrapper: FC<AsyncWrapperProps> = ({
  children,
  isLoading,
  loader,
  onRetryError,
  error,
}) => {
  return (
    <>
      {isLoading ? (
        loader ? (
          loader
        ) : (
          <CenterContent>
            <Spinner className="h-12 w-12" variant="primary" />
          </CenterContent>
        )
      ) : error ? (
        <ErrorWrapper error={error} onRetryError={onRetryError}>
          {children}
        </ErrorWrapper>
      ) : (
        children
      )}
    </>
  );
};

export { AsyncWrapper };
