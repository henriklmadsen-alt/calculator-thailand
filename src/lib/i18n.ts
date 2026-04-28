// i18n utility for language switching
import thLocale from '../i18n/locales/th.json';
import enLocale from '../i18n/locales/en.json';

export type Language = 'th' | 'en';

const locales = {
  th: thLocale,
  en: enLocale,
} as const;

export function getCurrentLanguage(url: string): Language {
  // Check if URL contains /en/ prefix
  return url.includes('/en/') || url.startsWith('/en-') ? 'en' : 'th';
}

export function getLanguageURL(path: string, lang: Language): string {
  const isEnglish = path.includes('/en/') || path.startsWith('/en-');
  const basePath = path.replace(/^\/en\//, '/').replace(/^\/en-/, '/');

  if (lang === 'en') {
    return `/en${basePath}`;
  }
  return basePath;
}

export function t(key: string, lang: Language = 'th'): string {
  const locale = locales[lang];
  return locale[key as keyof typeof locale] || key;
}

export function getLocale(lang: Language) {
  return locales[lang];
}

// SEO helpers
export function getHreflangLinks(currentPath: string) {
  const basePath = currentPath.replace(/^\/en\//, '/').replace(/^\/en-/, '/');
  return {
    th: basePath,
    en: `/en${basePath}`,
  };
}
