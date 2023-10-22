import Cookie from 'cookie';
import type { IncomingHttpHeaders } from 'http';

import type { PersistedState } from './launch';
import { agorasafeLaunchStorageName, initialState } from './launch';

const getLaunchInitialState = (
  headers: IncomingHttpHeaders | Headers,
  overrideState?: Partial<PersistedState>
): PersistedState => {
  const parsedInitialState = JSON.parse(
    JSON.stringify({ ...initialState, ...overrideState })
  ) as PersistedState;

  if (headers instanceof Object && 'host' in headers) {
    if (headers.cookie) {
      const cookies = Cookie.parse(headers.cookie);

      if (!cookies[agorasafeLaunchStorageName]) {
        return parsedInitialState;
      }

      const state = JSON.parse(
        cookies[agorasafeLaunchStorageName] ??
          JSON.stringify(parsedInitialState)
      ) as { state?: PersistedState };

      return state && state.state
        ? { ...state.state, ...overrideState }
        : parsedInitialState;
    }
  }

  if (headers instanceof Headers && 'get' in headers) {
    if (headers && headers.get('cookie')) {
      const cookies = Cookie.parse(headers.get('cookie') as string);

      if (!cookies[agorasafeLaunchStorageName]) {
        return parsedInitialState;
      }

      const state = JSON.parse(
        cookies[agorasafeLaunchStorageName] ??
          JSON.stringify(parsedInitialState)
      ) as { state?: PersistedState };

      return state && state.state
        ? { ...state.state, ...overrideState }
        : parsedInitialState;
    }
  }

  return parsedInitialState;
};

export { getLaunchInitialState };
