import { getRequestConfig } from 'next-intl/server';

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale;
  
  // Failsafe: if locale is missing or invalid, default to French
  if (!locale || !['fr', 'en'].includes(locale)) {
    locale = 'fr';
  }

  return {
    locale,
    messages: (await import(`../../messages/${locale}.json`)).default
  };
});