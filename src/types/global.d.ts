type AsyncReturnType<T extends (...args: any) => Promise<any>> = T extends (
  ...args: any
) => Promise<infer R>
  ? R
  : any;

type DeepPartial<T> = T extends object
  ? {
      [P in keyof T]?: DeepPartial<T[P]>;
    }
  : T;

type DeepNonNullable<T> = {
  [P in keyof T]-?: NonNullable<T[P]>;
} & NonNullable<T>;

type Prettify<T> = {
  [K in keyof T]: T[K];
} & unknown;

type InferNextProps<T extends (args: any) => any> = Awaited<
  Extract<Awaited<ReturnType<T>>, { props: any }>['props']
>;

type MixedObject = Record<string, any>;

// eslint-disable-next-line @typescript-eslint/no-unused-vars
let navigation: { currentEntry: { index: number } };
