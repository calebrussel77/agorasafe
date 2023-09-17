import Head from 'next/head';
import React from 'react';

const Meta = () => {
  return (
    <Head>
      <meta
        name="viewport"
        content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0"
      />
      <meta
        name="format-detection"
        content="telephone=no, date=no, email=no, address=no"
      />
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
  );
};

export { Meta };
