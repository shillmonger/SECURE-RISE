import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Check if the path is user-dashboard or admin-dashboard
  const isProtectedRoute = pathname.startsWith('/user-dashboard') || pathname.startsWith('/admin-dashboard');
  
  // Check if the path is the login page (to avoid redirect loop)
  const isAuthPage = pathname.startsWith('/auth-page/login');
  
  if (isProtectedRoute && !isAuthPage) {
    // Get the auth token from cookies (custom JWT authentication)
    const authToken = request.cookies.get('auth-token');
    
    // If no auth token, redirect to login
    if (!authToken) {
      const loginUrl = new URL('/auth-page/login', request.url);
      loginUrl.searchParams.set('callbackUrl', pathname);
      return NextResponse.redirect(loginUrl);
    }
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/user-dashboard/:path*',
    '/admin-dashboard/:path*',
  ],
};
