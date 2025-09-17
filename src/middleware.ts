import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const headers = Object.fromEntries(request.headers.entries());
  
  // Skip middleware for system paths and static files
  if (
    pathname.startsWith('/_next/') ||
    pathname.startsWith('/api/') ||
    pathname.startsWith('/favicon.ico') ||
    pathname.startsWith('/robots.txt') ||
    pathname.startsWith('/sitemap.xml') ||
    pathname.startsWith('/images/') ||
    pathname.startsWith('/public/') ||
    pathname.includes('.') // Skip files with extensions
  ) {
    console.log('⏭️ Skipping middleware for system path:', pathname);
    return NextResponse.next();
  }
  
  console.log('🔍 Middleware executed:', {
    pathname,
    search,
    host: headers['host'],
    'x-forwarded-host': headers['x-forwarded-host'],
    'x-forwarded-proto': headers['x-forwarded-proto'],
    referer: headers['referer']
  });

  // Check if URL ends with trailing slash
  const hasTrailingSlash = pathname.endsWith('/');
  
  // Special handling for root paths and language paths
  if (pathname === '/' || pathname.match(/^\/[a-z]{2}$/)) {
    console.log('✅ Root or language path, no redirect needed:', pathname);
    return NextResponse.next();
  }
  
  // If path doesn't have trailing slash, redirect to add it
  if (!hasTrailingSlash) {
    // Get the original host from headers (for rewritten requests)
    const originalHost = headers['x-forwarded-host'] || headers['host'];
    
    // Build the redirect URL with trailing slash
    let redirectUrl: URL;
    
    // If we have a referer that's different from current host, use it for redirect
    if (headers['referer'] && headers['x-forwarded-host']) {
      // This is a rewritten request
      const refererUrl = new URL(headers['referer']);
      redirectUrl = new URL(pathname + '/' + search, refererUrl.origin);
    } else {
      // Normal request
      redirectUrl = new URL(pathname + '/' + search, request.url);
    }
    
    console.log('🔄 Redirecting to add trailing slash:', {
      from: request.url,
      to: redirectUrl.toString(),
      originalHost,
      hasXForwardedHost: !!headers['x-forwarded-host']
    });
    
    // Return 301 redirect
    return NextResponse.redirect(redirectUrl, 301);
  }

  console.log('✅ No redirect needed for:', pathname);
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};