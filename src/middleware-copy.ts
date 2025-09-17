import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  
  // Skip middleware for certain paths
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
    console.log('⏭️ Skipping middleware for:', pathname);
    return NextResponse.next();
  }
  console.log('🔍 Middleware executed for:', pathname);

  // Check if URL ends with trailing slash
  const hasTrailingSlash = pathname.endsWith('/');
  console.log('📍 Path analysis:', {
    pathname,
    hasTrailingSlash,
    search,
    fullUrl: request.url
  });
  
  // If it's not the root path and doesn't have trailing slash, redirect
  if (pathname !== '/' && !hasTrailingSlash) {
    const redirectUrl = new URL(pathname + '/' + search, request.url);
    console.log('🔄 Redirecting:', {
      from: request.url,
      to: redirectUrl.toString(),
      reason: 'Adding trailing slash'
    });
    
    // Return 301 redirect to add trailing slash
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