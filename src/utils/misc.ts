import { isArray } from './type-guards';

export const randomBetween = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min + 1) + min);
};

export const wait = (t: number) =>
  new Promise(resolve => setTimeout(resolve, t));

export const makeRandomId = (): string =>
  Math.random().toString(36).substring(2, 8);

export const isStringsArray = (arr: Array<unknown>) =>
  arr.every(i => typeof i === 'string');

export const numberWithCommas = (number: number | string) =>
  number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');

export function getTimestampInSeconds() {
  return Math.floor(Date.now() / 1000);
}

export function generateArray(numElements: number) {
  return Array.from({ length: numElements }, (_, index) => index);
}

export const formatWord = (str: string) => {
  const sanitize = str?.trim()?.split('_')?.join(' ');
  return `${(sanitize[0] || '').toUpperCase()} ${sanitize
    ?.slice(1)
    ?.toLowerCase()}`;
};

export function stringToHslColor(
  input = 'Random name',
  s = 70,
  l = 60
): string {
  // Calculer un hash unique à partir de la chaîne d'entrée
  let hash = 0;
  for (let i = 0; i < input.length; i++) {
    hash = input.charCodeAt(i) + ((hash << 5) - hash);
  }
  // Générer les composantes HSL en utilisant le hash
  const hue = ((hash % 360) + 360) % 360; // Valeur de teinte entre 0 et 359
  // const saturation = 70; // Valeur de saturation constante pour des couleurs vives
  // const lightness = 60; // Valeur de luminosité constante pour des couleurs joyeuses

  // Construire la chaîne de couleur HSL
  const color = `hsl(${hue}, ${s}%, ${l}%)`;

  return color;
}

/**
 * Searches for a value in an array and returns the value if found, otherwise returns a default value.
 *
 * @param data - The array to search in.
 * @param find - The value to find.
 * @param defaultValue - The default value to return if the value is not found.
 *
 * @returns The found value if found, otherwise the default value.
 */
export function findMatch<T>(data: T[], find: T, defaultValue: T): T {
  const founded = data.findIndex(el => el === find);

  return founded >= 0 ? find : defaultValue;
}

export function formatPhoneNumber(phoneNumber: string) {
  const countryCode = phoneNumber?.slice(0, 4);
  const firstGroup = phoneNumber?.slice(4, 7);
  const secondGroup = phoneNumber?.slice(7, 9);
  const thirdGroup = phoneNumber?.slice(9, 11);
  const fourthGroup = phoneNumber?.slice(11);

  return `${countryCode} ${firstGroup} ${secondGroup} ${thirdGroup} ${fourthGroup}`;
}

//invariant for type checks
export const invariant: (
  condition: unknown,
  message?: string | (() => string)
) => asserts condition = (condition, message = 'Assertion Failed') => {
  if (!condition) {
    if (typeof message === 'string') throw new Error(message);
    throw new Error(message());
  }
};

export const noop = () => {};

export function getCompletionPercentage<T extends number | string | unknown>(
  elements: T[],
  step: number
): number {
  // Check that the step is within the valid range (between 0 and the length of the array - 1)
  if (step < 0 || step >= elements.length) {
    throw new Error('The step must be a valid index within the array.');
  }

  // Calculate the total of elements up to the given step
  const elementsUpToStep = elements.slice(0, step + 1);
  const total =
    typeof elements[0] === 'number'
      ? elementsUpToStep.reduce((acc, current) => acc + Number(current), 0)
      : elementsUpToStep.length;

  // Calculate the completion percentage
  const percentage = (total / elements.length) * 100;

  return Math.floor(percentage);
}
