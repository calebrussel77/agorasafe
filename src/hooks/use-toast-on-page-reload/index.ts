import { useRouter } from 'next/navigation';
import { startTransition, useEffect } from 'react';

const showToastStrorageKey = 'showToastOnRefresh';

// Custom hook for displaying a toast message after a page reload
const useToastOnPageReload = (toastFn: () => void) => {
  const router = useRouter();

  // Check if there's a flag in localStorage indicating the toast should be shown
  useEffect(() => {
    const shouldShowToast = localStorage.getItem(showToastStrorageKey);

    if (Boolean(shouldShowToast)) {
      // Display the toast message
      toastFn();

      // Remove the flag from localStorage
      localStorage.removeItem(showToastStrorageKey);
    }
  }, []);

  // Function to trigger the reload action and set the flag
  const reloadWithToast = () => {
    // Set the flag in localStorage to show the toast after the page reloads
    localStorage.setItem(showToastStrorageKey, 'true');

    // Refresh the page
    startTransition(() => {
      router.refresh();
    });
  };

  return { reloadWithToast };
};

export { useToastOnPageReload };
