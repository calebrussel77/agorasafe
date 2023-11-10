import htmlReactParser, {
  type HTMLReactParserOptions,
} from 'html-react-parser';
import { sanitize } from 'isomorphic-dompurify';
import { type ReactNode } from 'react';

export const htmlParse = (
  str: string,
  options?: HTMLReactParserOptions | undefined
) => {
  const clean = sanitize(str);

  return htmlReactParser(clean, options) as ReactNode;
};
