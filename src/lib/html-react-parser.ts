import htmlReactParser, {
  type HTMLReactParserOptions,
} from 'html-react-parser';
import { type ReactNode } from 'react';

export const htmlParse = (
  str: string,
  options?: HTMLReactParserOptions | undefined
) => {
  return htmlReactParser(str, options) as ReactNode;
};
