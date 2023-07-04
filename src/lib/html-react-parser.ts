import htmlReactParser, {
  type HTMLReactParserOptions,
} from 'html-react-parser';

export const htmlParse = (
  str: string,
  options?: HTMLReactParserOptions | undefined
) => {
  return htmlReactParser(str, options);
};
