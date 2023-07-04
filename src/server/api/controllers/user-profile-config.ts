import { USER_PROFILES_LIMIT_COUNT } from '@/constants';

import { getUserById } from '../repositories';
import { getAddProfileInfos, getFilteredLinksByType } from '../utils';

export const getUserProfileConfigController = async (inputs: {
  userId: string;
  profileId: string;
}) => {
  const { profileId, userId } = inputs;

  try {
    const user = await getUserById(userId);

    if (!user) {
      throw new Error('Utilisateur non trouvé, veuillez vous reconnecter !');
    }

    const currentProfile = user.profiles.find(
      profile => profile.id === profileId
    );
    const otherProfile = user.profiles.find(
      profile => profile.id !== profileId
    );
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
          ? `Switcher vers le profile ${otherProfile.name}`
          : null,
      },
      addProfileInfos: {
        canAddNewProfile: profileCount < USER_PROFILES_LIMIT_COUNT,
        ...getAddProfileInfos(currentProfile.type),
      },
      hasMoreThanOneProfile,
      hasProfile,
      success: true,
    };
  } catch (error) {
    throw new Error(error as string);
  }
};
