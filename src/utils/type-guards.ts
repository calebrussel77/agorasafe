export function isDefined<T>(argument: T | undefined | null): argument is T {
  return argument !== undefined && argument !== null;
}

export function isNumber(value: unknown) {
  return isNaN(Number(value)) === false;
}

export function isPromise(value: unknown): value is Promise<unknown> {
  return value instanceof Promise;
}

export function isValidURL(value: unknown): value is string {
  try {
    new URL(value as string);
    return true;
  } catch {
    return false;
  }
}

export function isDecimal(value: number | string) {
  return Number(value) % 1 != 0;
}

export function isArray(value: unknown): value is any[] {
  return Array.isArray(value);
}

export function isArrayOfFile(value: unknown): value is File[] {
  if (!isArray(value)) {
    return false; //The value is not an array
  }

  return value.every(element => element instanceof File);
}
