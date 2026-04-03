import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Get the session cookie
  const session = request.cookies.get('crm_session');
  
  // Public paths that don't require authentication
  const isPublicPath = request.nextUrl.pathname === '/login' || 
                       request.nextUrl.pathname.startsWith('/api/leads/incoming') ||
                       request.nextUrl.pathname.startsWith('/assets');

  // If user is not authenticated and trying to access a protected route
  if (!session && !isPublicPath) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // If user is authenticated and trying to access login page
  if (session && request.nextUrl.pathname === '/login') {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes - handled separately or let them pass for incoming)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
