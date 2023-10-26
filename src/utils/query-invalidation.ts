import { type api } from './api';

type ToggleableContent = 'profile-config' | 'service-requests';

export async function invalidateModeratedContent(
  queryUtils: ReturnType<typeof api.useContext>,
  changes: ToggleableContent[] | undefined = [
    'profile-config',
    'service-requests',
  ]
) {
  console.log('Invalidating moderated content...');
  const hasChangedProfileConfig = changes.includes('profile-config');
  const hasChangedServiceRequests = changes.includes('service-requests');

  if (hasChangedProfileConfig)
    await queryUtils.profileConfig.getProfileConfig.invalidate();

  if (hasChangedServiceRequests)
    await queryUtils.services.getAllServiceRequests.invalidate();

  await queryUtils.conversations.invalidate();
}
