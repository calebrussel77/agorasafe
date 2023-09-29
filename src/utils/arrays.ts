/**
 * Removes duplicate elements from an array using a custom comparator function.
 * @param array - The input array to remove duplicates from.
 * @param comparator - A custom function to compare elements for uniqueness.
 * @returns A new array with duplicate elements removed.
 */
export function uniqWith<T>(array: T[], comparator: (a: T, b: T) => boolean): T[] {
    const result: T[] = [];
    for (const element of array) {
      if (result.every(x => !comparator(x, element))) {
        result.push(element);
      }
    }
  
    return result;
  }
  