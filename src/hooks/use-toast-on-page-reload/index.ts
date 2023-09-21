import { useEffect } from 'react';

const showToastStrorageKey = 'showToastOnReload';

// Custom hook for displaying a toast message after a page reload
const useToastOnPageReload = (toastFn: () => void) => {
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

    // Reload the page
    window.location.reload();
  };

  return { reloadWithToast };
};

export { useToastOnPageReload };
