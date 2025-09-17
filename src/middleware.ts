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

  // Detect if this is a rewrite scenario from external domain (like w3bstream.com)
  const isRewriteScenario = detectRewriteScenario(headers);
  
  console.log('🔍 Rewrite scenario detection result:', isRewriteScenario);

  if (isRewriteScenario) {
    // For rewrite scenarios, we need to check if the original external URL needs trailing slash
    const externalPath = getExternalPath(pathname);
    const shouldRedirect = shouldRedirectForExternalPath(externalPath, pathname);
    
    if (shouldRedirect) {
      const externalOrigin = getExternalOrigin(headers);
      const redirectUrl = new URL(externalPath + '/' + search, externalOrigin);
      
      console.log('🔄 Redirecting rewrite scenario to external URL with trailing slash:', {
        from: request.url,
        to: redirectUrl.toString(),
        internalPath: pathname,
        externalPath: externalPath,
        externalOrigin: externalOrigin
      });
      
      return NextResponse.redirect(redirectUrl, 301);
    }
  } else {
    // Normal scenario - check internal URL trailing slash
    const hasTrailingSlash = pathname.endsWith('/');
    
    // Special handling for root path only
    if (pathname === '/') {
      console.log('✅ Root path, no redirect needed:', pathname);
      return NextResponse.next();
    }
    
    // If path doesn't have trailing slash, redirect to add it
    if (!hasTrailingSlash) {
      const redirectUrl = new URL(pathname + '/' + search, request.url);
      
      console.log('🔄 Redirecting to same host with trailing slash:', {
        from: request.url,
        to: redirectUrl.toString(),
        pathname: pathname
      });
      
      return NextResponse.redirect(redirectUrl, 301);
    }
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
  
  console.log('🔍 Rewrite detection details:', {
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
 * Check if we should redirect for external path based on the mapping
 */
function shouldRedirectForExternalPath(externalPath: string, internalPath: string): boolean {
  // Based on render rewrite config:
  // /blog/ → /mimo (or /iotex based on logs)
  // /blog* → /mimo* (or /iotex*)
  
  // If internal path has trailing slash but external path doesn't, we should redirect
  const internalHasSlash = internalPath.endsWith('/');
  const externalHasSlash = externalPath.endsWith('/');
  
  // Special case: if internal is /iotex/ or /mimo/ and external is /blog, we should redirect to /blog/
  if (internalHasSlash && !externalHasSlash) {
    if ((internalPath === '/iotex/' || internalPath === '/mimo/') && externalPath === '/blog') {
      return true;
    }
  }
  
  return false;
}

/**
 * Get the external path that should be used for redirect
 * Based on the render rewrite config and actual logs
 */
function getExternalPath(internalPath: string): string {
  // From the logs, it seems /blog is being rewritten to /iotex/
  // So we need to map back from /iotex/* to /blog/*
  if (internalPath.startsWith('/iotex/')) {
    return internalPath.replace('/iotex/', '/blog/');
  }
  if (internalPath === '/iotex') {
    return '/blog';
  }
  
  // Also handle /mimo mapping (in case it's used)
  if (internalPath.startsWith('/mimo/')) {
    return internalPath.replace('/mimo/', '/blog/');
  }
  if (internalPath === '/mimo') {
    return '/blog';
  }
  
  // For other project paths, map them to /blog/ as well
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
