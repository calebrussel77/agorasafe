import {
  type ParseOptions,
  type Stringifiable,
  type StringifyOptions,
} from 'query-string';
import queryString from 'query-string';

export abstract class QS {
  static stringify(query: Record<string, unknown>, options?: StringifyOptions) {
    return queryString.stringify(query, {
      skipEmptyString: true,
      skipNull: true,
      sort: false,
      ...options,
    });
  }

  static stringifyUrl(
    url: string,
    query: Record<string, Stringifiable | readonly Stringifiable[]>,
    options?: StringifyOptions
  ) {
    return queryString.stringifyUrl(
      { url, query },
      {
        skipEmptyString: true,
        skipNull: true,
        sort: false,
        encode: false,
        ...options,
      }
    );
  }

  static parse<T extends Record<string, unknown>>(
    search: string,
    options?: ParseOptions
  ) {
    return queryString.parse(search, {
      parseBooleans: true,
      parseNumbers: true,
      sort: false,
      ...options,
    }) as T;
  }
}
