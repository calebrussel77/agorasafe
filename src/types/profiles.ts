import { type GetUserProfilesOutput } from '@/features/profiles';

export type CurrentProfile = GetUserProfilesOutput['profiles'][0] | null;
