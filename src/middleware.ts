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
    // Detect if this is a rewrite scenario from external domain (like w3bstream.com)
    const isRewriteScenario = detectRewriteScenario(headers);
    
    let redirectUrl: URL;
    
    if (isRewriteScenario) {
      // This is a rewrite scenario, redirect to the external URL with trailing slash
      const externalPath = getExternalPath(pathname);
      const externalOrigin = getExternalOrigin(headers);
      redirectUrl = new URL(externalPath + '/' + search, externalOrigin);
      
      console.log('🔄 Redirecting rewrite scenario to external URL with trailing slash:', {
        from: request.url,
        to: redirectUrl.toString(),
        internalPath: pathname,
        externalPath: externalPath,
        externalOrigin: externalOrigin
      });
    } else {
      // Normal scenario, redirect to the same host with trailing slash
      redirectUrl = new URL(pathname + '/' + search, request.url);
      
      console.log('🔄 Redirecting to same host with trailing slash:', {
        from: request.url,
        to: redirectUrl.toString(),
        pathname: pathname
      });
    }
    
    // Return 301 redirect for SEO
    return NextResponse.redirect(redirectUrl, 301);
  }

  console.log('✅ No redirect needed for:', pathname);
  return NextResponse.next();
}

/**
 * Detect if this request is coming through a rewrite scenario from external domain
 */
function detectRewriteScenario(headers: Record<string, string>): boolean {
  const host = headers['host'] || '';
  const forwardedHost = headers['x-forwarded-host'] || '';
  const referer = headers['referer'] || '';
  
  // Check if the forwarded host is different from the actual host
  // This indicates a rewrite scenario
  const hasForwardedHost = Boolean(forwardedHost && forwardedHost !== host);
  
  // Check if the request is coming from an external domain
  const isFromExternalDomain = forwardedHost.includes('w3bstream.com') || 
                              referer.includes('w3bstream.com');
  
  // Check if this is not a direct access to unipost domains
  const isDirectAccess = host.includes('unipost.uni-labs.org') || 
                        host.includes('unipost-test-only.onrender.com') ||
                        host.includes('localhost');
  
  console.log('🔍 Rewrite detection:', {
    host,
    forwardedHost,
    hasForwardedHost,
    isFromExternalDomain,
    isDirectAccess,
    referer
  });
  
  return hasForwardedHost || isFromExternalDomain;
}

/**
 * Get the external path that should be used for redirect
 * Based on the render rewrite config:
 * /blog/ → /mimo
 * /blog* → /mimo*
 */
function getExternalPath(internalPath: string): string {
  // The rewrite maps /blog/* to /mimo/*
  // So we need to map back from /mimo/* to /blog/*
  if (internalPath.startsWith('/mimo/')) {
    return internalPath.replace('/mimo/', '/blog/');
  }
  if (internalPath === '/mimo') {
    return '/blog';
  }
  
  // For other project paths, map them to /blog/ as well
  if (internalPath.startsWith('/iotex/')) {
    return internalPath.replace('/iotex/', '/blog/');
  }
  if (internalPath === '/iotex') {
    return '/blog';
  }
  
  if (internalPath.startsWith('/depinscan/')) {
    return internalPath.replace('/depinscan/', '/blog/');
  }
  if (internalPath === '/depinscan') {
    return '/blog';
  }
  
  // For any other paths that might be accessed directly, assume they should be under /blog/
  if (!internalPath.startsWith('/blog/')) {
    return `/blog${internalPath}`;
  }
  
  return internalPath;
}

/**
 * Get the external origin for redirect
 */
function getExternalOrigin(headers: Record<string, string>): string {
  const forwardedHost = headers['x-forwarded-host'];
  const forwardedProto = headers['x-forwarded-proto'] || 'https';
  const referer = headers['referer'];
  
  // Try to get origin from forwarded headers first (most reliable)
  if (forwardedHost) {
    return `${forwardedProto}://${forwardedHost}`;
  }
  
  // Try to get origin from referer as backup
  if (referer) {
    try {
      const refererUrl = new URL(referer);
      return refererUrl.origin;
    } catch (e) {
      console.warn('Failed to parse referer URL:', referer);
    }
  }
  
  // Fallback to w3bstream.com (the main external domain)
  return 'https://w3bstream.com';
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
