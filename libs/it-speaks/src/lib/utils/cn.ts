import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

// TODO: move this to shared `utils` library
export const cn = (...inputs: ClassValue[]) => {
  return twMerge(clsx(inputs));
};
