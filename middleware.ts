import createMiddleware from 'next-intl/middleware';
import { NextResponse, type NextRequest } from 'next/server';

import { isSupabaseConfigured } from './lib/supabase/config';
import { refreshSession } from './lib/supabase/middleware';
import { routing } from './routing';

const intlMiddleware = createMiddleware(routing);

const LOGIN_PATH = '/admin/login';

/**
 * `/admin` vive fuera del segmento `[locale]`, así que se resuelve antes de
 * next-intl (que si no le agregaría prefijo de idioma y daría 404).
 */
export default async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname === '/admin' || pathname.startsWith('/admin/')) {
    return handleAdmin(request, pathname);
  }

  return intlMiddleware(request);
}

async function handleAdmin(request: NextRequest, pathname: string) {
  const response = NextResponse.next({ request });
  response.headers.set('X-Robots-Tag', 'noindex, nofollow');

  // Sin credenciales el panel muestra su pantalla de "falta configurar".
  if (!isSupabaseConfigured) return response;

  // Refresca el token y escribe las cookies nuevas sobre `response`.
  const user = await refreshSession(request, response);
  const isLoginPage = pathname === LOGIN_PATH;

  if (!user && !isLoginPage) {
    const url = request.nextUrl.clone();
    url.pathname = LOGIN_PATH;
    url.search = '';
    // Sólo se propaga el pathname interno, para no habilitar un open redirect.
    if (pathname !== '/admin') url.searchParams.set('next', pathname);
    return withCookies(NextResponse.redirect(url), response);
  }

  if (user && isLoginPage) {
    const url = request.nextUrl.clone();
    url.pathname = '/admin';
    url.search = '';
    return withCookies(NextResponse.redirect(url), response);
  }

  return response;
}

/** Traslada las cookies de sesión refrescadas a una respuesta de redirect. */
function withCookies(target: NextResponse, source: NextResponse) {
  for (const cookie of source.cookies.getAll()) {
    target.cookies.set(cookie);
  }
  target.headers.set('X-Robots-Tag', 'noindex, nofollow');
  return target;
}

export const config = {
  // Todas las rutas menos las internas de Next, los archivos estáticos y las
  // API (que resuelven su propia autorización y no llevan prefijo de idioma).
  matcher: ['/', '/(es|en)/:path*', '/((?!api|_next|_vercel|.*\\..*).*)']
};
