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
        defaultTitle="Agorasafe - Connectez vos besoins aux meilleurs talents de votre région"
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
              width: 800,
              height: 400,
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
