import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const host = request.headers.get('host') || '';

  // Debug logging
  console.log(`[Middleware] Host: ${host}, Path: ${pathname}`);

  // Simple test - add a custom header to verify middleware is running
  const response = NextResponse.next();
  response.headers.set('X-Middleware-Test', 'working');

  // Define project mappings
  const projectMappings: Record<string, string> = {
    'iotex.io': 'iotex',
    'mimo.exchange': 'mimo',
    'blog.depinscan.io': 'depinscan',
  };

  // Handle requests to unipost.uni-labs.org (internal domain)
  if (host === 'unipost.uni-labs.org') {
    for (const prefix of Object.values(projectMappings)) {
      // Handle internal path normalization - remove trailing slash for consistency
      if (pathname.startsWith(`/${prefix}/`) && pathname.endsWith('/') && pathname !== `/${prefix}/`) {
        const cleanPath = pathname.slice(0, -1); // Remove trailing slash
        console.log(`[Middleware] Normalizing internal path: ${pathname} -> ${cleanPath}`);
        const url = request.nextUrl.clone();
        url.pathname = cleanPath;
        const rewriteResponse = NextResponse.rewrite(url);
        rewriteResponse.headers.set('X-Middleware-Normalize', `${pathname} -> ${cleanPath}`);
        return rewriteResponse;
      }
      
      // Handle project root with trailing slash
      if (pathname === `/${prefix}/`) {
        console.log(`[Middleware] Normalizing project root: ${pathname} -> /${prefix}`);
        const url = request.nextUrl.clone();
        url.pathname = `/${prefix}`;
        const rewriteResponse = NextResponse.rewrite(url);
        rewriteResponse.headers.set('X-Middleware-Normalize', `${pathname} -> /${prefix}`);
        return rewriteResponse;
      }
    }
    
    console.log(`[Middleware] Internal domain request: ${pathname}`);
    return response;
  }

  // For external domains, let Render handle the rewriting
  // We don't need to do anything here since Render's rewrite rules handle it
  console.log(`[Middleware] External domain request: ${host}${pathname}`);
  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - sitemap.xml (sitemap file)
     * - robots.txt (robots file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)',
  ],
};