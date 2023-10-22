import { type LaunchStore, Provider, initializeLaunchStore } from './launch';

type LaunchStoreProviderProps = React.PropsWithChildren<
  LaunchStore | null | undefined
>;

const LaunchStoreProvider = ({
  children,
  ...props
}: LaunchStoreProviderProps) => {
  return <Provider value={initializeLaunchStore(props)}>{children}</Provider>;
};

export { LaunchStoreProvider };
