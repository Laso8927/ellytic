import {getRequestConfig} from 'next-intl/server';

export const locales = ["en", "de", "el", "nl"] as const;
export type Locale = typeof locales[number];
export const defaultLocale: Locale = "en";

export default getRequestConfig(async ({locale}) => {
  const resolved = (locales as readonly string[]).includes(String(locale)) ? String(locale) as Locale : defaultLocale;
  return {
    locale: resolved,
    messages: (await import(`../messages/${resolved}.json`)).default
  };
});