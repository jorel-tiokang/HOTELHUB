import createMiddleware from 'next-intl/middleware';
 
export default createMiddleware({
  locales: ['fr', 'en'],
  defaultLocale: 'fr'
});
 
export const config = {
  // Skip all internal paths and static files, only match pages
  matcher: ['/((?!api|_next|.*\\..*).*)']
};