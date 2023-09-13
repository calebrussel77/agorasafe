import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

type Booleanish = boolean | "true" | "false";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const dataAttr = (condition: boolean | undefined) =>
  (condition ? "true" : undefined) as Booleanish;