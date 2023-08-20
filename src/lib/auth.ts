export const shouldUseSecureCookies =
  process.env.NEXTAUTH_URL?.startsWith('https://');
const cookiePrefix = shouldUseSecureCookies ? '__Secure-' : '';

export const agorasafeTokenCookieName = `${cookiePrefix}agorasafe-token`;
