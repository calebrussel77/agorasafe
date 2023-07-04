import { type Session } from 'next-auth';
import { SessionProvider } from 'next-auth/react';
import { type FC } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { ToastContainer } from 'react-toastify';

import { FullPageError } from '@/components/ui/error';

type TAppContextProps = {
  children: React.ReactNode;
  session?: Session | null;
};

const AppContext: FC<TAppContextProps> = ({ children, session }) => {
  return (
    <ErrorBoundary FallbackComponent={FullPageError}>
      <ToastContainer
        hideProgressBar
        position="bottom-right"
        newestOnTop
        closeButton={false}
        className="w-full max-w-md bg-transparent px-3"
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      <SessionProvider session={session}>{children}</SessionProvider>
    </ErrorBoundary>
  );
};

export { AppContext };
