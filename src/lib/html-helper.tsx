import { linkBlockList } from '@/data';
import htmlReactParser, {
  type Element,
  type HTMLReactParserOptions,
  attributesToProps,
} from 'html-react-parser';
import { type Config, sanitize } from 'isomorphic-dompurify';
import { type ReactNode } from 'react';

import { isNumber, isValidURL } from '@/utils/type-guards';

export const sanitizeHTML = (str: string | Node, config?: Config) =>
  sanitize(str, {
    ALLOWED_TAGS: [
      'p',
      'strong',
      'em',
      'u',
      's',
      'ul',
      'ol',
      'li',
      'a',
      'br',
      'img',
      'iframe',
      'div',
      'code',
      'pre',
      'span',
      'h1',
      'h2',
      'h3',
      'hr',
    ],
    ...config,
  });

export const htmlParse = (
  str: string,
  options?: HTMLReactParserOptions | undefined
) => {
  return htmlReactParser(sanitizeHTML(str) as never, {
    replace(domNode) {
      const { attribs, tagName, children } = domNode as Element;

      if (!attribs) {
        return;
      }
      if (attribs && tagName === 'a') {
        const props = attributesToProps(attribs);
        const updatedHref = attribs?.href?.startsWith('http')
          ? children
          : `http://${children as unknown as string}`;

        const hrefDomain = isValidURL(updatedHref)
          ? new URL(updatedHref).hostname
          : undefined;

        if (!hrefDomain) {
          return <span {...props} />;
        }

        const isBlocked = linkBlockList.some(domain => domain === hrefDomain);
        if (isBlocked) {
          return <span className="font-semibold">[Lien Bloqué]</span>;
        }
        return <a {...props} />;
      }
    },
    ...options,
  }) as ReactNode;
};

/**
 * GitHub Copilot made this :^) -Manuel
 */
export function isLightColor(hexColor: string) {
  const hex = hexColor.startsWith('#') ? hexColor.replace('#', '') : hexColor;
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 2), 16);
  const b = parseInt(hex.substring(4, 2), 16);
  const yiq = (r * 299 + g * 587 + b * 114) / 1000;

  return yiq >= 128;
}

/**
 * Thrown together with ChatGPT :^) -Manuel
 */
type ColorSwapOptions = {
  hexColor: string;
  colorScheme: 'dark' | 'light';
  threshold?: number;
};
export function needsColorSwap({
  hexColor,
  colorScheme,
  threshold = 0.5,
}: ColorSwapOptions) {
  // Remove the '#' symbol if present
  hexColor = hexColor.startsWith('#') ? hexColor.replace('#', '') : hexColor;

  // Convert the hex color to RGB values
  const r = parseInt(hexColor.substring(0, 2), 16);
  const g = parseInt(hexColor.substring(2, 4), 16);
  const b = parseInt(hexColor.substring(4), 16);

  // Calculate the relative luminance of the color
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  if (!isNumber(luminance)) return false;

  // Compare the luminance to a threshold value
  if (colorScheme === 'dark') {
    if (luminance > threshold) {
      // Color is closer to white (light)
      return false;
    } else {
      // Color is closer to black (dark)
      return true;
    }
  } else {
    if (luminance > threshold) {
      // Color is closer to white (light)
      return true;
    } else {
      // Color is closer to black (dark)
      return false;
    }
  }
}
