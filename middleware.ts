import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Get the pathname of the request
  const path = request.nextUrl.pathname;

  // Define protected routes
  const protectedRoutes = ['/dashboard'];
  const isProtectedRoute = protectedRoutes.some(route => path.startsWith(route));

  // Define auth routes (login, signup)
  const authRoutes = ['/signin', '/signup'];
  const isAuthRoute = authRoutes.some(route => path === route);

  // Get token from cookies (if using httpOnly cookies) or check for auth headers
  const token = request.cookies.get('access_token')?.value || 
                request.headers.get('authorization')?.replace('Bearer ', '');

  // For now, let the client-side handle authentication
  // This prevents potential redirect loops during login/logout
  if (isProtectedRoute) {
    // Let the client-side layout handle authentication
    return NextResponse.next();
  }

  // If accessing auth routes while already authenticated (optional)
  if (isAuthRoute && token) {
    // Redirect to dashboard
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!api|_next/static|_next/image|favicon.ico|public).*)',
  ],
}; 