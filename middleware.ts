import createMiddleware from 'next-intl/middleware';
import {routing} from './routing';

export default createMiddleware(routing);

export const config = {
  // Match all pathnames except Next.js internals and static files
  matcher: ['/', '/(es|en)/:path*', '/((?!_next|_vercel|.*\\..*).*)']
};
