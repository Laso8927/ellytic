import {getRequestConfig} from 'next-intl/server';

export const locales = ["en", "de", "el", "nl"] as const;
export type Locale = typeof locales[number];
export const defaultLocale: Locale = "en";

export default getRequestConfig(async ({locale}) => ({
  locale,
  messages: (await import(`../messages/${locale}.json`)).default
}));