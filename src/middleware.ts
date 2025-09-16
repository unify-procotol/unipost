import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  console.log(`[Middleware] Path: ${pathname}`);
  
  // Skip static files and API routes
  if (pathname.includes('.') || pathname.startsWith('/api') || pathname.startsWith('/_next')) {
    return NextResponse.next();
  }
  
  // If path already has trailing slash, proceed normally
  if (pathname.endsWith('/')) {
    console.log(`[Middleware] Path has trailing slash, render normally: ${pathname}`);
    return NextResponse.next();
  }
  
  // For paths without trailing slash, simply add it using absolute URL
  const url = request.nextUrl.clone();
  url.pathname = `${pathname}/`;
  
  console.log(`[Middleware] Adding trailing slash: ${pathname} -> ${url.toString()}`);
  return NextResponse.redirect(url.toString(), 301);
}

export const config = {
  matcher: [
    // Match all paths except:
    // - api routes
    // - _next/static (static files)
    // - _next/image (image optimization files)  
    // - favicon.ico (favicon file)
    '/((?!api|_next/static|_next/image|favicon.ico).*)'
  ],
};