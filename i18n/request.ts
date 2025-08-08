import {getRequestConfig} from 'next-intl/server';

export const locales = ["en", "de", "el", "nl"] as const;
export type Locale = typeof locales[number];
export const defaultLocale: Locale = "en";

function nestMessages(flat: Record<string, any>): Record<string, any> {
  const nested: Record<string, any> = {};
  for (const [key, value] of Object.entries(flat || {})) {
    const parts = key.split('.');
    let cursor = nested;
    for (let i = 0; i < parts.length - 1; i++) {
      const part = parts[i];
      if (!cursor[part] || typeof cursor[part] !== 'object') cursor[part] = {};
      cursor = cursor[part];
    }
    cursor[parts[parts.length - 1]] = value;
  }
  return nested;
}

export default getRequestConfig(async ({locale}) => {
  const resolved = (locales as readonly string[]).includes(String(locale)) ? String(locale) as Locale : defaultLocale;
  const mod = await import(`../messages/${resolved}.json`);
  return {
    locale: resolved,
    messages: nestMessages(mod.default as any)
  };
});