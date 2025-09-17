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
    'x-original-host': headers['x-original-host'],
    'cf-connecting-ip': headers['cf-connecting-ip'],
    referer: headers['referer']
  });

  // Check if URL ends with trailing slash
  const hasTrailingSlash = pathname.endsWith('/');
  
  // Special handling for root path
  if (pathname === '/') {
    console.log('✅ Root path, no redirect needed:', pathname);
    return NextResponse.next();
  }
  
  // Detect if this is a rewrite scenario
  const isRewriteScenario = detectRewriteScenario(pathname, headers);
  
  console.log('🔍 Rewrite scenario detection result:', isRewriteScenario);

  // If path doesn't have trailing slash, we need to redirect
  if (!hasTrailingSlash) {
    let redirectUrl: URL;
    
    if (isRewriteScenario) {
      // For rewrite scenarios, redirect to the external URL with trailing slash
      const externalPath = getExternalPath(pathname);
      const externalOrigin = getExternalOrigin(headers, pathname);
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
    
    // Return 301 redirect
    return NextResponse.redirect(redirectUrl, 301);
  }

  console.log('✅ No redirect needed for:', pathname);
  return NextResponse.next();
}

/**
 * Detect if this request is coming through a rewrite scenario
 * Since Cloudflare doesn't always pass X-Forwarded-Host, we need to use other signals
 */
function detectRewriteScenario(pathname: string, headers: Record<string, string>): boolean {
  const host = headers['host'] || '';
  const forwardedHost = headers['x-forwarded-host'] || headers['x-original-host'] || '';
  
  // Method 1: Check if we have forwarded headers
  if (forwardedHost && forwardedHost !== host) {
    console.log('🔍 Detected rewrite via forwarded headers');
    return true;
  }
  
  // Method 2: Check if the pathname suggests a rewrite
  // If we're receiving /iotex/, /mimo/, or /depinscan/ paths, it's likely a rewrite from /blog/
  if (pathname.startsWith('/iotex') || pathname.startsWith('/mimo') || pathname.startsWith('/depinscan')) {
    console.log('🔍 Detected rewrite via pathname pattern');
    return true;
  }
  
  // Method 3: Check if we're on a render/test domain but not accessing /blog path
  const isRenderDomain = host.includes('onrender.com') || host.includes('uni-labs.org');
  const isNotBlogPath = !pathname.startsWith('/blog');
  if (isRenderDomain && isNotBlogPath && 
      (pathname.startsWith('/iotex') || pathname.startsWith('/mimo') || pathname.startsWith('/depinscan'))) {
    console.log('🔍 Detected rewrite via domain and path combination');
    return true;
  }
  
  return false;
}

/**
 * Get the external path that should be used for redirect
 */
function getExternalPath(internalPath: string): string {
  // Map internal project paths to /blog/
  if (internalPath.startsWith('/iotex/')) {
    return internalPath.replace('/iotex/', '/blog/');
  }
  if (internalPath === '/iotex') {
    return '/blog';
  }
  
  if (internalPath.startsWith('/mimo/')) {
    return internalPath.replace('/mimo/', '/blog/');
  }
  if (internalPath === '/mimo') {
    return '/blog';
  }
  
  if (internalPath.startsWith('/depinscan/')) {
    return internalPath.replace('/depinscan/', '/blog/');
  }
  if (internalPath === '/depinscan') {
    return '/blog';
  }
  
  // Default: assume it should be under /blog/
  if (!internalPath.startsWith('/blog/')) {
    return `/blog${internalPath}`;
  }
  
  return internalPath;
}

/**
 * Get the external origin for redirect
 * Since we can't always rely on forwarded headers, we need to be smart about this
 */
function getExternalOrigin(headers: Record<string, string>, pathname: string): string {
  const forwardedHost = headers['x-forwarded-host'] || headers['x-original-host'];
  const forwardedProto = headers['x-forwarded-proto'] || 'https';
  
  // If we have forwarded host, use it
  if (forwardedHost) {
    return `${forwardedProto}://${forwardedHost}`;
  }
  
  // If pathname suggests it's from w3bstream (iotex project), use w3bstream.com
  if (pathname.startsWith('/iotex')) {
    return 'https://w3bstream.com';
  }
  
  // For other projects, we might need different domains
  // For now, default to w3bstream.com
  return 'https://w3bstream.com';
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
