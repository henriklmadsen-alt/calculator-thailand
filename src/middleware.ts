// i18n middleware for language routing
import { defineMiddleware } from 'astro:middleware';

export const onRequest = defineMiddleware((context, next) => {
  const { pathname } = context.url;

  // Detect language from URL
  const isEnglish = pathname.startsWith('/en/') || pathname.startsWith('/en-');
  const lang = isEnglish ? 'en' : 'th';

  // Store language in context for use in templates
  context.locals.language = lang;
  context.locals.currentPath = pathname;

  // Get hreflang variants for current page
  const basePath = pathname.replace(/^\/en\//, '/').replace(/^\/en-/, '/');
  context.locals.hreflang = {
    th: basePath,
    en: `/en${basePath}`,
  };

  return next();
});
