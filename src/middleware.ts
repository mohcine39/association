import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Define paths that require authentication
  const isAdminPath = pathname.startsWith('/admin');
  const isLoginPath = pathname === '/admin/login';
  const isApiAdminPath = pathname.startsWith('/api/events') || pathname.startsWith('/api/sync');

  // Skip middleware for the login page itself to avoid infinite loops
  if (isLoginPath) {
    return NextResponse.next();
  }

  // Check for admin session cookie
  const session = request.cookies.get('admin_session');
  const adminSecret = process.env.ADMIN_SECRET;

  // Protect Admin Dashboard
  if (isAdminPath) {
    if (!session || session.value !== adminSecret) {
      const loginUrl = new URL('/admin/login', request.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  // Protect Admin API routes (POST, PATCH, DELETE)
  if (isApiAdminPath && ['POST', 'PATCH', 'DELETE'].includes(request.method)) {
    if (!session || session.value !== adminSecret) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }
  }

  return NextResponse.next();
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: [
    '/admin/:path*',
    '/api/events/:path*',
    '/api/sync/:path*',
  ],
};
