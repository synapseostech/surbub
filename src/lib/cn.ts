import { clsx, type ClassValue } from 'clsx';
import { extendTailwindMerge } from 'tailwind-merge';

/**
 * Teach tailwind-merge about SUBURB+'s custom type scale so that
 * classes like `text-h1` are not mistaken for text colours.
 */
const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      'font-size': [
        {
          text: ['display', 'display-sm', 'h1', 'h2', 'h3', 'card', 'body-lg', 'body', 'label', 'micro'],
        },
      ],
    },
  },
});

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
