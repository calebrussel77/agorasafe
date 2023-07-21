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
