import { DefaultSeo as DefaultNextSeo } from 'next-seo';
import Head from 'next/head';
import Script from 'next/script';

const DOMAIN_URL = 'https://agorasafe.vercel.app';

const DefaultSeo = () => {
  return (
    <>
      <DefaultNextSeo
        defaultTitle="Agorasafe - Accédez à des services de qualité aux prix abordables au Cameroun."
        titleTemplate="%s | Agorasafe"
        languageAlternates={[
          { href: `${DOMAIN_URL}`, hrefLang: 'en' },
          { href: `${DOMAIN_URL}/fr`, hrefLang: 'fr' },
        ]}
        description="Agorasafe est la plateforme idéale pour les prestataires de services amateurs qui souhaitent présenter leurs compétences et talents à un public plus large, tout en aidant les clients à trouver des services abordables qui répondent à leurs besoins."
        openGraph={{
          type: 'website',
          locale: 'fr_FR',
          url: `${DOMAIN_URL}/`,
          images: [
            {
              url: `${DOMAIN_URL}/preview-agorasafe.png`,
              alt: 'agorasafe preview',
              type: 'image/png',
            },
          ],
          site_name: 'agorasafe',
        }}
      />
      <Head>
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="application-name" content="agorasafe" />
        <meta name="apple-mobile-web-app-title" content="agorasafe" />
        <meta name="theme-color" content="#ffff" />
        <meta name="msapplication-navbutton-color" content="#ffff" />
        <meta name="author" content="Caleb Russel" />
        <meta
          name="keywords"
          content="agorasafe, mise en relation, services à domicile, cameroun, prestataire amateurs, prix abordables, services abordables, vente, shop"
        />
        <meta
          name="apple-mobile-web-app-status-bar-style"
          content="black-translucent"
        />
        <meta name="msapplication-starturl" content="/" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, shrink-to-fit=no"
        />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="192x192"
          href="/android-chrome-192x192.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="512x512"
          href="/android-chrome-512x512.png"
        />
      </Head>
      <Script
        src="https://www.googletagmanager.com/gtag/js?id=G-6HRCBQQZHN"
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
        
          gtag('config', 'G-6HRCBQQZHN');
        `}
      </Script>
    </>
  );
};

export { DefaultSeo };
