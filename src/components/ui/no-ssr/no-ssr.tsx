import { useMountedState } from 'react-use';

interface Props {
  children: React.ReactNode; // React.ReactNode
  fallback?: JSX.Element | null; // JSX.Element
}

const NoSSR = ({ children, fallback = null }: Props) => {
  const isMounted = useMountedState();

  if (!isMounted()) {
    return fallback;
  }

  return <>{children}</>;
};

export { NoSSR };
