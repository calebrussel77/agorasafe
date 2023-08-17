import { Head, Html, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang="fr" className="scroll-smooth">
      <Head />
      <body className="h-screen scroll-smooth bg-white font-sans text-base text-gray-900 antialiased">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
