/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { resolveHref } from 'next/dist/shared/lib/router/router';
import Router, { useRouter } from 'next/router';
import { createContext, useContext, useEffect, useRef } from 'react';
import { type UrlObject } from 'url';
import { create } from 'zustand';

import { QS } from '@/lib/qs';

import { useDidUpdate } from '@/hooks/use-did-update';

type Url = UrlObject | string;

type BrowserRouterState = {
  asPath: string;
  query: Record<string, any>;
  state?: Record<string, any>;
};

const BrowserRouterContext = createContext<{
  asPath: string;
  query: Record<string, any>;
  state: Record<string, any>;
  push: (url: Url, as?: Url, state?: Record<string, any>) => void;
  replace: (url: Url, as?: Url, state?: Record<string, any>) => void;
  back: () => void;
} | null>(null);

export const useBrowserRouter = () => {
  const context = useContext(BrowserRouterContext); //eslint-disable-line
  if (!context) throw new Error('missing context');
  return context;
};

export function BrowserRouterProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const stateRef = useRef<BrowserRouterState>();

  const parseQuery = (state?: any) => {
    if (!state && typeof window === 'undefined') return {};
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
    const [path, queryString] = (state?.url ?? history.state.url).split('?');
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    return QS.parse(queryString);
  };

  const {
    asPath = router.asPath,
    query = QS.parse(QS.stringify(router.query)),
    state = {},
  } = useBrowserRouterState();

  useDidUpdate(() => {
    useBrowserRouterState.setState({
      asPath: router.asPath,
      query: QS.parse(QS.stringify(router.query)),
    });
  }, [router]); //eslint-disable-line

  useEffect(() => {
    const popstateFn = (e: PopStateEvent) =>
      dispatchEvent(new CustomEvent('locationchange', { detail: [e.state] }));

    const locationChangeFn = (e: Event) => {
      const event = e as CustomEvent;
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      const state = event.detail[0];
      stateRef.current = {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        asPath: state.as,
        query: parseQuery(state),
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        state: history.state.state,
      };
      if (!isUsingNextRouter) useBrowserRouterState.setState(stateRef.current);
    };

    addEventListener('popstate', popstateFn);
    addEventListener('locationchange', locationChangeFn);
    return () => {
      removeEventListener('popstate', popstateFn);
      removeEventListener('locationchange', locationChangeFn);
    };
  }, []);

  useEffect(() => {
    const handleRouteChangeComplete = () => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      if (stateRef.current && stateRef.current?.asPath === history.state.as)
        useBrowserRouterState.setState(stateRef.current);

      setIsUsingNextRouter(false);
    };

    router.events.on('routeChangeComplete', handleRouteChangeComplete);

    return () => {
      router.events.off('routeChangeComplete', handleRouteChangeComplete);
    };
  }, []); //eslint-disable-line

  return (
    <BrowserRouterContext.Provider
      value={{ asPath, query, state, ...browserRouterControls }}
    >
      {children}
    </BrowserRouterContext.Provider>
  );
}

const goto = (
  type: 'replace' | 'push',
  url: Url,
  as?: Url,
  state?: Record<string, any>
) => {
  const [_url, _urlAs] = resolveHref(Router, url, true);
  const [, _as] = as ? resolveHref(Router, as, true) : [_url, _urlAs];

  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const historyState = {
    ...history.state,
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
    state: { ...history?.state?.state, ...state },
    // key: uuidv4(),
    url: _url,
    as: _as,
  };

  type === 'replace'
    ? history.replaceState(historyState, '', _as)
    : history.pushState(historyState, '', _as);

  window.dispatchEvent(
    new CustomEvent('locationchange', { detail: [historyState] })
  );
};

const browserRouterControls = {
  push: (url: Url, as?: Url, state?: Record<string, any>) =>
    goto('push', url, as, state),
  replace: (url: Url, as?: Url, state?: Record<string, any>) =>
    goto('replace', url, as, state),
  back: () => history.go(-1),
};

const useBrowserRouterState = create<{
  asPath?: string;
  query?: Record<string, any>;
  state?: Record<string, any>;
}>(() => ({}));

export const getBrowserRouter = () => {
  const isClient = typeof window !== 'undefined';
  const {
    query = isClient ? Router.query : undefined,
    asPath = isClient ? Router.asPath : undefined,
  } = useBrowserRouterState.getState();
  return { query, asPath, ...browserRouterControls };
};

let isUsingNextRouter = false;
export const setIsUsingNextRouter = (value: boolean) => {
  isUsingNextRouter = value;
};
