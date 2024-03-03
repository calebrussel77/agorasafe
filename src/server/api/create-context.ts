/* eslint-disable @typescript-eslint/no-unsafe-call */

/* eslint-disable @typescript-eslint/no-unsafe-member-access */

/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { getInitialState } from '@/stores/profile-store/initial-state';
import { type NextApiRequest, type NextApiResponse } from 'next';
import requestIp from 'request-ip';

import { getServerAuthSession } from '../auth';
import { Tracker } from '../utils/tracker';

type CacheSettings = {
  browserTTL?: number;
  edgeTTL?: number;
  staleWhileRevalidate?: number;
  tags?: string[];
  canCache?: boolean;
};

export const createContext = async ({
  req,
  res,
}: {
  req: NextApiRequest;
  res: NextApiResponse;
}) => {
  const session = await getServerAuthSession({ req, res });
  const initialState = getInitialState(req.headers);
  const track = new Tracker(req, res);
  const ip = requestIp.getClientIp(req) ?? '';

  const cache: CacheSettings | null = {
    browserTTL: session?.user ? 0 : 60,
    edgeTTL: session?.user ? 0 : 60,
    staleWhileRevalidate: session?.user ? 0 : 30,
    canCache: true,
  };

  return {
    user: session?.user,
    profile: initialState?.profile,
    track,
    ip,
    cache,
    res,
  };
};

export type Context = AsyncReturnType<typeof createContext>;
