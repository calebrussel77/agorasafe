import { type ProfileType, type Role } from '@prisma/client';
import { type PropsWithChildren, type ReactElement } from 'react';

import { useCurrentUser } from '@/hooks/use-current-user';

interface GetCanViewCheck
  extends Pick<CanViewProps, 'accessCheck' | 'allowedProfiles'> {
  profileTypes: Array<ProfileType>;
  userRole: Role | undefined;
}

interface CanViewProps {
  accessCheck?: () => boolean;
  isPublic?: boolean;
  allowedProfiles?: Array<ProfileType>;
  renderNoAccess?: () => JSX.Element | null;
  children: ReactElement | null;
}

const checkPermissions = (
  userPermissions: GetCanViewCheck['profileTypes'],
  allowedProfiles: CanViewProps['allowedProfiles']
) => {
  if (allowedProfiles?.length === 0) {
    return true;
  }

  return userPermissions.some(permission =>
    allowedProfiles?.includes(permission)
  );
};

const getCanViewCheck = ({
  profileTypes,
  userRole,
  accessCheck,
  allowedProfiles,
}: GetCanViewCheck) => {
  const isAdmin = userRole === 'ADMIN';

  // Admin users can do anything
  // if (isAdmin) return true;

  // when an accessCheck function is provided, ensure that passes as well as the permissions
  if (accessCheck) {
    return accessCheck() && checkPermissions(profileTypes, allowedProfiles);
  }

  // otherwise only check permissions
  return checkPermissions(profileTypes, allowedProfiles);
};

const CanView = ({
  accessCheck,
  isPublic = false,
  allowedProfiles = [],
  renderNoAccess = () => null,
  children,
}: PropsWithChildren<CanViewProps>) => {
  const { profile: currentProfile, session, status } = useCurrentUser();
  const profileTypes = currentProfile?.type ? [currentProfile?.type] : [];

  if (status === 'loading') return <></>;

  //For some actions who need to be also public
  if (isPublic && status === 'unauthenticated') return children;

  const hasPermission = getCanViewCheck({
    profileTypes,
    userRole: session?.user?.role,
    accessCheck,
    allowedProfiles,
  });

  return hasPermission ? children : renderNoAccess();
};

const useHasPermission = ({
  accessCheck,
  isPublic = false,
  allowedProfiles = [],
}: Pick<CanViewProps, 'accessCheck' | 'allowedProfiles' | 'isPublic'>) => {
  const { profile: currentProfile, session, status } = useCurrentUser();
  const profileTypes = currentProfile?.type ? [currentProfile?.type] : [];

  if (isPublic && status === 'unauthenticated') return true;

  const hasPermission = getCanViewCheck({
    profileTypes,
    userRole: session?.user?.role,
    accessCheck,
    allowedProfiles,
  });

  return { hasPermission };
};

export { CanView, useHasPermission };
