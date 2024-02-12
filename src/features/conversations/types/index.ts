import { type DirectMessage } from '@prisma/client';

import { type SimpleProfile } from '@/server/api/modules/profiles';

export type MessageWithWithProfile = DirectMessage & {
  profile: SimpleProfile;
};
