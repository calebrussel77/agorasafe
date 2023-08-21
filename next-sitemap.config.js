// https://github.com/iamvishnusankar/next-sitemap#configuration-options

/** @type {import('next-sitemap').IConfig} */
const NextSitemapConfig = {
  siteUrl: process.env.NEXT_PUBLIC_APP_URL || 'https://agorasafe.vercel.app',
  exclude: ['/404'],
  generateRobotsTxt: process.env.NEXT_PUBLIC_VERCEL_ENV === 'production',
  robotsTxtOptions: {
    policies: [
      {
        userAgent: '*',
        disallow: ['/404'],
      },
      { userAgent: '*', allow: '/' },
    ],
  },
  generateIndexSitemap: false,
};

module.exports = NextSitemapConfig;
