import { USER_PROFILES_LIMIT_COUNT } from '@/constants';

import { throwNotFoundError } from '../../../utils/error-handling';
import { getUserById } from '../users';
import {
  getAddProfileInfos,
  getFilteredLinksByType,
} from './profile-config.utils';

export const getProfileConfigService = async (inputs: {
  profileId: string;
  userId: string;
}) => {
  const { profileId, userId } = inputs;

  const user = await getUserById(userId);

  if (!user) {
    throwNotFoundError('Utilisateur non trouvé.');
  }

  const currentProfile = user.profiles.find(
    profile => profile.id === profileId
  );

  if (!currentProfile) {
    throwNotFoundError('Profil non trouvé !');
  }

  const otherProfile = user.profiles.find(profile => profile.id !== profileId);
  const profileCount = user._count.profiles;
  const hasProfile = profileCount > 0;
  const hasMoreThanOneProfile = profileCount > 1;
  const switchProfileMessage = otherProfile ? `Changer de Profil` : null;

  return {
    appProfileLinks: getFilteredLinksByType(currentProfile.type),
    canSwitchToOtherProfile: hasMoreThanOneProfile,
    switchProfileMessage,
    canAddNewProfile: profileCount < USER_PROFILES_LIMIT_COUNT,
    ...getAddProfileInfos(currentProfile.type),
    hasProfile,
  };
};
