import { type TRPCClientErrorLike } from '@trpc/client';
import React, { type FC, type ReactElement, type ReactNode } from 'react';

import { ErrorWrapper, SectionError } from '@/components/ui/error';
import { CenterContent } from '@/components/ui/layout';
import { Spinner } from '@/components/ui/spinner';

import { type AppRouter } from '@/server/api/root';

interface AsyncWrapperProps {
  children: ReactNode;
  isLoading: boolean;
  loader?: ReactElement | JSX.Element;
  error: TRPCClientErrorLike<AppRouter> | null;
  onRetry?: () => void;
}
const AsyncWrapper: FC<AsyncWrapperProps> = ({
  children,
  isLoading,
  loader,
  onRetry,
  error,
}) => {
  return (
    <>
      {isLoading ? (
        loader ? (
          loader
        ) : (
          <CenterContent>
            <Spinner className="h-12 w-12" />
          </CenterContent>
        )
      ) : error ? (
        <CenterContent>
          <SectionError error={error} onRetry={onRetry} />
        </CenterContent>
      ) : (
        <ErrorWrapper>{children}</ErrorWrapper>
      )}
    </>
  );
};

export { AsyncWrapper };
