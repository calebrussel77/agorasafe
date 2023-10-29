import { useMedia } from 'react-use';

export const useIsMobile = (defaultState = false) => {
  const isMobile = useMedia('(max-width: 620px)', defaultState);

  return isMobile;
};

export const useIsComputer = (defaultState = false) => {
  const isMobile = useMedia('(min-width: 1024px)', defaultState);

  return isMobile;
};
