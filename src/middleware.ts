import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const host = request.headers.get('host') || '';
  
  console.log(`[Middleware] Host: ${host}, Path: ${pathname}`);
  
  // Skip static files and API routes
  if (pathname.includes('.') || pathname.startsWith('/api') || pathname.startsWith('/_next')) {
    return NextResponse.next();
  }
  
  // If path already has trailing slash, proceed normally
  if (pathname.endsWith('/')) {
    console.log(`[Middleware] Path has trailing slash, render normally: ${pathname}`);
    return NextResponse.next();
  }
  
  // Only handle redirects when on unipost domain
  if (host.includes('unipost')) {
    // Extract project from path (e.g., /iotex/article -> iotex)
    const pathParts = pathname.split('/').filter(Boolean);
    if (pathParts.length > 0) {
      const project = pathParts[0];
      
      // Map projects to their original domains
      const projectDomains: Record<string, string> = {
        'iotex': 'https://iotex.io/blog',
        'mimo': 'https://mimo.exchange/blog',
      };
      
      if (projectDomains[project]) {
        // Remove project prefix from path and add trailing slash
        const restPath = pathParts.slice(1).join('/');
        const redirectUrl = restPath 
          ? `${projectDomains[project]}/${restPath}/`
          : `${projectDomains[project]}/`;
        
        console.log(`[Middleware] Redirecting: ${pathname} -> ${redirectUrl}`);
        return NextResponse.redirect(redirectUrl, 301);
      }
    }
  }
  
  // For other cases, add trailing slash to current URL
  const url = request.nextUrl.clone();
  url.pathname = `${pathname}/`;
  console.log(`[Middleware] Adding trailing slash: ${pathname} -> ${url.pathname}`);
  return NextResponse.redirect(url, 301);
}

export const config = {
  matcher: [
    // Match all paths except:
    // - api routes
    // - _next/static (static files)
    // - _next/image (image optimization files)  
    // - favicon.ico (favicon file)
    '/((?!api|_next/static|_next/image|favicon.ico).*)'
  ],
};