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
  
  // Special handling for root path only
  if (pathname === '/') {
    console.log('✅ Root path, no redirect needed:', pathname);
    return NextResponse.next();
  }
  
  // If path doesn't have trailing slash, redirect to add it
  if (!hasTrailingSlash) {
    let redirectPath = pathname + '/';
    
    // Handle rewrite case: if this is a rewrite from /blog/* to /iotex/*
    // we need to redirect back to the original /blog/* path
    if (pathname.startsWith('/iotex/') && headers['referer']) {
      try {
        const refererUrl = new URL(headers['referer']);
        if (refererUrl.pathname.startsWith('/blog/')) {
          // Map back from /iotex/xxx to /blog/xxx
          const articleSlug = pathname.replace('/iotex/', '');
          redirectPath = `/blog/${articleSlug}/`;
        }
      } catch (e) {
        // If referer parsing fails, fallback to normal redirect
      }
    }
    
    const redirectUrl = new URL(redirectPath + search, request.url);
    
    console.log('🔄 Redirecting to add trailing slash:', {
      from: request.url,
      to: redirectUrl.toString(),
      pathname: pathname,
      redirectPath: redirectPath,
      referer: headers['referer']
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