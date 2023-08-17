import { type NextPage } from 'next';
import { type ReactElement, type ReactNode } from 'react';

/**
*Usefull to prettify more intersection types
* eg: type Intersected = {
    a: number;
} & {
    b: number;
} & {
    c: number;
}
}

Resolution: export type TResult = Prettify<Intersected>;
**/
export type Prettify<T> = {
  [K in keyof T]: T[K];
} & unknown;

// Exclude keys from model
export function Exclude<T, Key extends keyof T>(
  model: T,
  keys: Key[]
): Omit<T, Key> {
  for (const key of keys) {
    delete model[key];
  }
  return model;
}

export type ObjectValues<T> = T[keyof T];

export type ComponentWithProps<T> = T extends React.ComponentType<infer P>
  ? P
  : object;

export type NextPageWithLayout<P = Record<string, never>, IP = P> = NextPage<
  P,
  IP
> & {
  getLayout?: (page: ReactElement) => ReactNode;
};
