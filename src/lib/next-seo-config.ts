import { APP_NAME } from '@/constants';
import { type DefaultSeoProps, type NextSeoProps } from 'next-seo';

export type HeadSeoProps = {
  title: string;
  description: string;
  siteName?: string;
  url?: string;
  canonical?: string;
  nextSeoProps?: NextSeoProps;
};

/**
 * This function builds a canonical URL from a given host and path omitting the query params. Note: on homepage it omits the trailing slash
 * @param origin The protocol + host, e.g. `https://agorasafe.com` or `https://agorasafe.dev`
 * @param path NextJS' useRouter().asPath
 * @returns
 */
export const buildCanonical = ({
  origin,
  path,
}: {
  origin: Location['origin'];
  path: string;
}) => {
  return `${origin}${path === '/' ? '' : path}`.split('?')[0];
};

export const seoConfig: {
  headSeo: Required<Pick<HeadSeoProps, 'siteName'>>;
  defaultNextSeo: DefaultSeoProps;
} = {
  headSeo: {
    siteName: APP_NAME,
  },
  defaultNextSeo: {
    twitter: {
      handle: '@agorasafe',
      site: '@agorasafe',
      cardType: 'summary_large_image',
    },
  },
} as const;
