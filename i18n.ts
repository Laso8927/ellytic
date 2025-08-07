import { createInstance } from 'i18next';
import { initReactI18next } from 'react-i18next';

const initI18next = async (locale: string, ns: string) => {
  const i18nInstance = createInstance();
  await i18nInstance
    .use(initReactI18next)
    .init({
      lng: locale,
      fallbackLng: 'en',
      ns: [ns],
      defaultNS: ns,
      resources: {
        en: {
          common: require('./i18n/locales/en/common.json'),
        },
        de: {
          common: require('./i18n/locales/de/common.json'),
        },
        el: {
          common: require('./i18n/locales/el/common.json'),
        },
        nl: {
          common: require('./i18n/locales/nl/common.json'),
        },
      },
      interpolation: {
        escapeValue: false,
      },
    });
  return i18nInstance;
};

export default initI18next; 