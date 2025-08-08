import {defineRouting} from 'next-intl/routing';

export const routing = defineRouting({
  locales: ['en', 'de', 'el', 'nl'],
  defaultLocale: 'en',
  localePrefix: 'never'
});