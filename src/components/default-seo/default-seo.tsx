import { APP_NAME, WEBSITE_URL } from '@/constants';
import { DefaultSeo as DefaultNextSeo, type DefaultSeoProps } from 'next-seo';

import {
  DEFAULT_APP_DESCRIPTION,
  DEFAULT_APP_IMAGE_PREVIEW,
} from '@/lib/next-seo-config';

const DefaultSeo = (props: DefaultSeoProps) => {
  return (
    <>
      <DefaultNextSeo
        defaultTitle="Agorasafe - Accédez à des services de qualité aux prix abordables au Cameroun."
        titleTemplate="%s | Agorasafe"
        languageAlternates={[
          { href: `${WEBSITE_URL}`, hrefLang: 'en' },
          { href: `${WEBSITE_URL}/fr`, hrefLang: 'fr' },
        ]}
        description={DEFAULT_APP_DESCRIPTION}
        openGraph={{
          type: 'website',
          locale: 'fr_FR',
          url: `${WEBSITE_URL}/`,
          images: [
            {
              url: DEFAULT_APP_IMAGE_PREVIEW,
              width: 1200,
              height: 630,
              alt: 'Agorasafe.com',
              type: 'image/png',
            },
          ],
          site_name: APP_NAME,
        }}
        twitter={{
          cardType: 'summary_large_image',
          handle: '@CalebElat',
        }}
        {...props}
      />
    </>
  );
};

export { DefaultSeo };
