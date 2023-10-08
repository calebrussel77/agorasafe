import {
  type ProfileStore,
  Provider,
  initializeProfileStore,
} from './profiles';

type ProfileStoreProviderProps = React.PropsWithChildren<
  ProfileStore | null | undefined
>;

const ProfileStoreProvider = ({
  children,
  ...props
}: ProfileStoreProviderProps) => {
  return <Provider value={initializeProfileStore(props)}>{children}</Provider>;
};

export { ProfileStoreProvider };
