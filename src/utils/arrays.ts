/* eslint-disable @typescript-eslint/ban-ts-comment */
/**
 * Removes duplicate elements from an array using a custom comparator function.
 * @param array - The input array to remove duplicates from.
 * @param comparator - A custom function to compare elements for uniqueness.
 * @returns A new array with duplicate elements removed.
 * see https://youmightnotneed.com/lodash#unionBy : lodash implementation
 */
export function removeDuplicates<T>(
  array: T[],
  comparator: (a: T, b: T) => boolean
): T[] {
  const result: T[] = [];
  for (const element of array) {
    if (result.every(x => !comparator(x, element))) {
      result.push(element);
    }
  }

  return result;
}

/**
 * @example Transform from ['Apple', 'Banana', 'Orange'] to "Apple, Banana and Orange"
 */
export function toStringList(array: string[]) {
  const formatter = new Intl.ListFormat('en', {
    style: 'long',
    type: 'conjunction',
  });
  return formatter.format(array);
}

export function sortAlphabetically<T>(array: T[]) {
  return array.sort((a, b) => {
    if (a < b) return -1;
    if (a > b) return 1;
    return 0;
  });
}
export function sortAlphabeticallyBy<T>(array: T[], fn: (item: T) => string) {
  return array.sort((...args) => {
    const a = fn(args[0]);
    const b = fn(args[1]);
    if (a < b) return -1;
    if (a > b) return 1;
    return 0;
  });
}

export function shuffle<T>(array: T[]): T[] {
  let currentIndex = array.length,
    randomIndex;

  // Tant qu'il reste des éléments à mélanger...
  while (currentIndex !== 0) {
    // Choisissez un élément restant...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // Et échangez-le avec l'élément actuel.
    //@ts-ignore
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex],
      array[currentIndex],
    ];
  }

  return array;
}
