import { useEffect } from 'react';

import { wait } from '@/utils/misc';

const showToastStrorageKey = 'showToastOnReload';

// Custom hook for displaying a toast message after a page reload
const useToastOnPageReload = (toastFn: () => void) => {
  // Check if there's a flag in localStorage indicating the toast should be shown

  useEffect(() => {
    const shouldShowToast = localStorage.getItem(showToastStrorageKey);

    if (Boolean(shouldShowToast)) {
      wait(700)
        .then(() => {
          // Display the toast message
          toastFn();
        })
        .catch(e => console.log(e));

      // Remove the flag from localStorage
      localStorage.removeItem(showToastStrorageKey);
    }
  }, []);

  // Function to trigger the reload action and set the flag
  const reloadWithToast = () => {
    // Set the flag in localStorage to show the toast after the page reloads
    localStorage.setItem(showToastStrorageKey, 'true');

    // Reload the page
    window.location.reload();
  };

  return { reloadWithToast };
};

export { useToastOnPageReload };
