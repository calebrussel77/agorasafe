export function isDefined<T>(argument: T | undefined | null): argument is T {
  return argument !== undefined && argument !== null;
}

export function isNumber(value: unknown): value is number {
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

export function isEmpty(element: unknown): boolean {
  if (element === null || element === undefined) {
    // Check for null or undefined
    return true;
  }

  if (typeof element === 'string') {
    // Check for an empty string
    return element.trim() === '';
  }

  if (typeof element === 'number') {
    // Check for NaN (which is considered empty for numbers)
    return isNaN(element);
  }

  if (isArray(element)) {
    // Check for an empty array or an array of empty objects
    if (element.length === 0) {
      return true;
    }
    if (
      element.every(
        item =>
          typeof item === 'object' && Object.keys(item as object).length === 0
      )
    ) {
      return true;
    }
  }

  if (typeof element === 'object') {
    // Check for an empty object
    return Object.keys(element).length === 0;
  }

  // If none of the conditions match, consider the element not empty
  return false;
}

export function isEmptyArray(value: unknown): value is [] {
  return Array.isArray(value) && value.length === 0;
}

export function isDecimal(value: number | string) {
  return Number(value) % 1 != 0;
}

/**
 * Checks if a value is an array.
 * @param value - The value to check.
 * @returns True if the value is an array, false otherwise.
 */
export function isArray(value: unknown): value is any[] {
  return Array.isArray(value);
}

export function isString(value: unknown): value is string {
  return typeof value === 'string';
}

export function isArrayOfFile(value: unknown): value is File[] {
  if (!isArray(value)) return false;
  return value.every(element => element instanceof File);
}

export function isRegExpString(input: string): boolean {
  try {
    // Attempt to create a RegExp object from the input string
    new RegExp(input);
    return true; // If successful, it's a valid regex
  } catch (e) {
    return false; // If an error occurs, it's not a valid regex
  }
}

/**
 * Checks if a value is nil (null or undefined).
 * @param value - The value to check.
 * @returns `true` if the value is nil, `false` otherwise.
 */
export function isNil(value: unknown): boolean {
  return value === null || value === undefined;
}

export const isWindowDefined = () => {
  return typeof window !== 'undefined';
};
