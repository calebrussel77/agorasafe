import { type GetUserProfilesOutput } from '@/features/profiles';

export type CurrentProfile = GetUserProfilesOutput['profiles'][number] | null;
