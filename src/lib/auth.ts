import { WEBSITE_URL } from '@/constants';

export const shouldUseSecureCookies = WEBSITE_URL?.startsWith('https://');
export const cookiePrefix = shouldUseSecureCookies ? '__Secure-' : '';

export const agorasafeTokenCookieName = `${cookiePrefix}agorasafe-token`;
