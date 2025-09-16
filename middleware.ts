import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const host = request.headers.get('host') || '';

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
        const url = request.nextUrl.clone();
        url.pathname = `/${prefix}`;
        return NextResponse.rewrite(url);
      }
      
      // Handle /blog/* routes
      if (pathname.startsWith('/blog/')) {
        const pathAfterBlog = pathname.slice(6); // Remove '/blog/'
        if (pathAfterBlog) {
          const url = request.nextUrl.clone();
          // Handle trailing slash - remove it for consistent internal routing
          const cleanPath = pathAfterBlog.endsWith('/') ? pathAfterBlog.slice(0, -1) : pathAfterBlog;
          url.pathname = cleanPath ? `/${prefix}/${cleanPath}` : `/${prefix}`;
          return NextResponse.rewrite(url);
        }
      }
    }
  }

  // Handle direct access to internal paths on unipost.uni-labs.org
  if (host === 'unipost.uni-labs.org') {
    // Check if path starts with a known project prefix
    for (const prefix of Object.values(projectMappings)) {
      if (pathname.startsWith(`/${prefix}/`) || pathname === `/${prefix}` || pathname === `/${prefix}/`) {
        // Handle trailing slash normalization for direct access
        if (pathname.endsWith('/') && pathname !== '/') {
          const url = request.nextUrl.clone();
          url.pathname = pathname.slice(0, -1); // Remove trailing slash
          return NextResponse.rewrite(url);
        }
        
        // This is a direct access to internal path - allow it to proceed normally
        // The dynamic route will handle the rendering
        return NextResponse.next();
      }
    }
  }

  // For all other requests, continue normally
  return NextResponse.next();
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