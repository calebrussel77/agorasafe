// https://github.com/iamvishnusankar/next-sitemap#configuration-options

/** @type {import('next-sitemap').IConfig} */
const NextSitemapConfig = {
  siteUrl: process.env.SITE_URL || 'https://agorasafe.vercel.app',
  generateRobotsTxt: true,
  changefreq: 'daily',
};

module.exports = NextSitemapConfig;
