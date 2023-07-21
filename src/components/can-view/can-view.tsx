import { useProfileStore } from '@/stores/profiles';
import { ProfileType } from '@prisma/client';
import { type FC, type ReactNode } from 'react';

const ALLOWED_STATES = [...Object.keys(ProfileType), 'ANONYMOUS'];

interface CanViewProps {
  profiles: Array<ProfileType & 'ANONYMOUS'>;
  children: ReactNode;
}

const CanView: FC<CanViewProps> = ({ profiles, children }) => {
  useProfileStore();

  if (!profiles.some(el => ALLOWED_STATES.includes(String(el)))) {
    return;
  }

  return children;
};

export { CanView };
