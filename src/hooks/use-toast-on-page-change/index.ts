import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

const useToastOnPageChange = (desiredUrl: string, toastFn: () => void) => {
  const router = useRouter();

  useEffect(() => {
    // Listen for route changes
    const handleRouteChange = (url: string) => {
      // Check if the URL has changed to the desired route
      if (url === desiredUrl) {
        // Display the toast message function
        toastFn();
      }
    };

    // Add the route change listener
    // router.events.on('routeChangeComplete', handleRouteChange);

    // Clean up the listener when the component unmounts
    return () => {
      // router.events.off('routeChangeComplete', handleRouteChange);
    };
  }, [desiredUrl, toastFn]);
};

export { useToastOnPageChange };
