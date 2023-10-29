import { isArray, isNil } from './type-guards';

/**
 * Removes properties with empty or nil values from an object.
 * @param obj - The object to remove empty properties from.
 * @returns A new object with empty or nil properties removed.
 */
export function removeEmpty<T extends Record<string, unknown>>(
  obj: T
): Partial<T> {
  const result: Partial<T> = {};

  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      const value = obj[key];

      if (!isNil(value) && (!isArray(value) || value.length > 0)) {
        result[key] = value;
      }
    }
  }

  return result;
}
