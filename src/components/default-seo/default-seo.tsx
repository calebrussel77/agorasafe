import {
  APP_NAME,
  APP_URL,
  DEFAULT_APP_DESCRIPTION,
  DEFAULT_APP_IMAGE,
  OG_HEIGHT,
  OG_WIDTH,
} from '@/constants';
import { DefaultSeo as DefaultNextSeo, type DefaultSeoProps } from 'next-seo';

const DefaultSeo = (props: DefaultSeoProps) => {
  return (
    <>
      <DefaultNextSeo
        defaultTitle="Agorasafe - Connectez vos besoins aux meilleurs talents de votre région"
        titleTemplate="%s | Agorasafe"
        languageAlternates={[
          { href: `${APP_URL}`, hrefLang: 'en' },
          { href: `${APP_URL}/fr`, hrefLang: 'fr' },
        ]}
        description={DEFAULT_APP_DESCRIPTION}
        openGraph={{
          type: 'website',
          locale: 'fr_FR',
          url: `${APP_URL}/`,
          images: [
            {
              url: DEFAULT_APP_IMAGE,
              width: OG_WIDTH,
              height:  OG_HEIGHT,
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
