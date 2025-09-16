import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const host = request.headers.get('host') || '';

  // Debug logging - this should appear in logs if middleware is working
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

  // Handle external domain rewrite to internal paths
  for (const [domain, prefix] of Object.entries(projectMappings)) {
    if (host === domain) {
      // Handle /blog and /blog/ routes
      if (pathname === '/blog' || pathname === '/blog/') {
        console.log(`[Middleware] Rewriting ${pathname} to /${prefix}`);
        const url = request.nextUrl.clone();
        url.pathname = `/${prefix}`;
        const rewriteResponse = NextResponse.rewrite(url);
        rewriteResponse.headers.set('X-Middleware-Rewrite', `${pathname} -> /${prefix}`);
        return rewriteResponse;
      }
      
      // Handle /blog/* routes - simplified version
      if (pathname.startsWith('/blog/')) {
        const pathAfterBlog = pathname.slice(6); // Remove '/blog/'
        if (pathAfterBlog) {
          // Clean trailing slash
          const cleanPath = pathAfterBlog.endsWith('/') ? pathAfterBlog.slice(0, -1) : pathAfterBlog;
          const newPath = cleanPath ? `/${prefix}/${cleanPath}` : `/${prefix}`;
          
          console.log(`[Middleware] Rewriting ${pathname} to ${newPath}`);
          const url = request.nextUrl.clone();
          url.pathname = newPath;
          const rewriteResponse = NextResponse.rewrite(url);
          rewriteResponse.headers.set('X-Middleware-Rewrite', `${pathname} -> ${newPath}`);
          return rewriteResponse;
        }
      }
    }
  }

  // Handle direct access to internal paths on unipost.uni-labs.org
  if (host === 'unipost.uni-labs.org') {
    for (const prefix of Object.values(projectMappings)) {
      if (pathname.startsWith(`/${prefix}/`) || pathname === `/${prefix}` || pathname === `/${prefix}/`) {
        console.log(`[Middleware] Direct access to internal path: ${pathname}`);
        return response;
      }
    }
  }

  console.log(`[Middleware] No rewrite needed for ${host}${pathname}`);
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