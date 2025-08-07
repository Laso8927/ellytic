module.exports = {
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'de', 'el', 'nl'],
    localeDetection: true,
  },
  localePath: './i18n/locales',
  reloadOnPrerender: process.env.NODE_ENV === 'development',
} 