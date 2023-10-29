import { isWindowDefined } from '@/utils/type-guards';

export const useHasClientHistory = (to = '/') => {
  if (!isWindowDefined()) return false;

  const requestedPath = `${window.location.protocol}//${window.location.host}${to}`;
  if (window.history.length > 2 && document.referrer === requestedPath) {
    return true;
  }
  return false;
};
