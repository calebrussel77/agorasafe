import { WEBSITE_URL } from '@/constants';
import type { NextSeoProps } from 'next-seo';
import { NextSeo } from 'next-seo';
import { useRouter } from 'next/router';

import { truncateOnWord } from '@/utils/text';

import {
  DEFAULT_APP_DESCRIPTION,
  DEFAULT_APP_IMAGE_PREVIEW,
  buildCanonical,
  seoConfig,
} from '@/lib/next-seo-config';

export type SeoProps = {
  title: string;
  description?: string | null;
  image?: string;
  siteName?: string;
  url?: string;
  canonical?: string;
  nextSeoProps?: NextSeoProps;
};

/**
 * Build full seo tags from title, desc, canonical and url
 */
const buildSeoMeta = (pageProps: {
  title: string;
  description: string;
  image: string;
  siteName?: string;
  url?: string;
  canonical?: string;
}): NextSeoProps => {
  const {
    title,
    description,
    image,
    canonical,
    siteName = seoConfig.headSeo.siteName,
  } = pageProps;
  return {
    title: title || undefined,
    canonical: canonical,
    description,
    openGraph: {
      site_name: siteName,
      type: 'website',
      title: title,
      description: description,
      images: [
        {
          url: image,
          width: 800,
          height: 400,
          alt: 'Agorasafe',
          type: 'image/png',
        },
      ],
    },
    additionalMetaTags: [
      {
        name: 'Charset',
        content: 'UTF-8',
      },
      {
        name: 'Distribution',
        content: 'Global', // indicates that your webpage is intended for everyone
      },
      {
        name: 'Rating',
        content: 'General', // lets the younger web-surfers know the content is appropriate
      },
      {
        property: 'name',
        content: title,
      },
      {
        name: 'description',
        content: description,
      },
      {
        property: 'image',
        content: image,
      },
    ],
  };
};

const Seo = (props: SeoProps): JSX.Element => {
  const router = useRouter();
  // The below code sets the defaultUrl for our canonical tags
  // Get the router's path
  const defaultUrl = buildCanonical({
    path: router?.asPath,
    origin: WEBSITE_URL,
  });

  const {
    title,
    description,
    image = DEFAULT_APP_IMAGE_PREVIEW,
    siteName,
    canonical = defaultUrl,
    nextSeoProps = {},
  } = props;

  const truncatedDescription = truncateOnWord(
    description || DEFAULT_APP_DESCRIPTION,
    158
  );

  const seoObject = buildSeoMeta({
    title,
    image: image ?? DEFAULT_APP_IMAGE_PREVIEW,
    description: truncatedDescription,
    canonical,
    siteName,
  });

  const seoProps: NextSeoProps = { ...nextSeoProps, ...seoObject };

  return <NextSeo {...seoProps} />;
};

export { Seo };
