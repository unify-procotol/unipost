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
    // Build the redirect URL with trailing slash
    const redirectUrl = new URL(pathname + '/' + search, request.url);
    
    console.log('🔄 Redirecting to add trailing slash:', {
      from: request.url,
      to: redirectUrl.toString(),
      pathname: pathname,
      newPath: pathname + '/'
    });
    
    // Return 301 redirect - Next.js will handle the rewrite context
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