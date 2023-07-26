import { USER_PROFILES_LIMIT_COUNT } from '@/constants';

import { getUserById } from '../users';
import {
  getAddProfileInfos,
  getFilteredLinksByType,
} from './profile-config.utils';
import { type GetProfileConfigValidation } from './profile-config.validations';

export const getProfileConfigService = async (
  data: GetProfileConfigValidation
) => {
  const { profile_id, user_id } = data;

  const user = await getUserById(user_id);

  if (!user) {
    throw new Error('Utilisateur non trouvé, veuillez vous reconnecter !');
  }

  const currentProfile = user.profiles.find(
    profile => profile.id === profile_id
  );
  const otherProfile = user.profiles.find(profile => profile.id !== profile_id);
  const profileCount = user._count.profiles;
  const hasProfile = profileCount > 0;
  const hasMoreThanOneProfile = profileCount > 1;

  if (!currentProfile) {
    throw new Error('Profile non trouvé !');
  }

  return {
    profileLinks: getFilteredLinksByType(currentProfile.type),
    switchProfileInfos: {
      canSwitchToOtherProfile: hasMoreThanOneProfile,
      switchProfileText: otherProfile
        ? `Switcher vers le profil ${otherProfile.name}`
        : null,
    },
    addProfileInfos: {
      canAddNewProfile: profileCount < USER_PROFILES_LIMIT_COUNT,
      ...getAddProfileInfos(currentProfile.type),
    },
    hasMoreThanOneProfile,
    hasProfile,
  };
};
