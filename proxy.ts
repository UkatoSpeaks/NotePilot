import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const sessionToken = request.cookies.get('session-token')?.value;

  // 1. Auth Redirects: If user is logged in, don't let them visit login/signup
  const authPages = ['/login', '/signup'];
  if (authPages.some(page => pathname.startsWith(page))) {
    if (sessionToken === 'true') {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
  }

  // 2. Authentication Guard: Protect dashboard routes
  if (pathname.startsWith('/dashboard')) {
    if (sessionToken !== 'true') {
      // Save the attempted URL to redirect back after login
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('callbackUrl', pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  // 3. API Security & Rate Limiting (Basic)
  // Protect AI generation routes from unauthorized direct API calls
  if (pathname.startsWith('/api/generate')) {
    if (sessionToken !== 'true') {
      return NextResponse.json(
        { error: 'Unauthorized. Please login to use AI features.' },
        { status: 401 }
      );
    }
    
    // Add custom header to track internal requests
    const response = NextResponse.next();
    response.headers.set('X-NotePilot-Source', 'proxy-verified');
    return response;
  }

  return NextResponse.next();
}

// Config to specify which paths the proxy runs on
export const config = {
  matcher: [
    '/dashboard/:path*',
    '/login',
    '/signup',
    '/api/:path*',
  ],
};
