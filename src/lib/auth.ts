import { APP_URL } from '@/constants';

export const shouldUseSecureCookies = APP_URL?.startsWith('https://');
export const cookiePrefix = shouldUseSecureCookies ? '__Secure-' : '';

export const agorasafeTokenCookieName = `${cookiePrefix}agorasafe-token`;
