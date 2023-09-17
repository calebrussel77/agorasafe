import { WEBSITE_URL } from '@/constants';
import type { NextSeoProps } from 'next-seo';
import { NextSeo } from 'next-seo';
import { usePathname } from 'next/navigation';

import { truncateOnWord } from '@/utils/text';

import {
  APP_IMAGE_PREVIEW,
  buildCanonical,
  seoConfig,
} from '@/lib/next-seo-config';

export type SeoProps = {
  title: string;
  description: string;
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
    title: title,
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
        },
      ],
    },
    additionalMetaTags: [
      {
        property: 'name',
        content: title,
      },
      {
        property: 'description',
        content: description,
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
  const path = usePathname();
  // The below code sets the defaultUrl for our canonical tags
  // Get the router's path
  const defaultUrl = buildCanonical({ path, origin: WEBSITE_URL });

  const {
    title,
    description,
    image = APP_IMAGE_PREVIEW,
    siteName,
    canonical = defaultUrl,
    nextSeoProps = {},
  } = props;

  const truncatedDescription = truncateOnWord(description, 158);
  const seoObject = buildSeoMeta({
    title,
    image,
    description: truncatedDescription,
    canonical,
    siteName,
  });

  const seoProps: NextSeoProps = { ...nextSeoProps, ...seoObject };

  return <NextSeo {...seoProps} />;
};

export { Seo };
