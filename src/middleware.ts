import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const host = request.headers.get('host') || '';
  const xForwardedHost = request.headers.get('x-forwarded-host') || '';
  
  console.log(`[Middleware] Host: ${host}, X-Forwarded-Host: ${xForwardedHost}, Path: ${pathname}`);
  
  // Skip static files and API routes
  if (pathname.includes('.') || pathname.startsWith('/api') || pathname.startsWith('/_next')) {
    return NextResponse.next();
  }
  
  // If path already has trailing slash, proceed normally
  if (pathname.endsWith('/')) {
    console.log(`[Middleware] Path has trailing slash, render normally: ${pathname}`);
    return NextResponse.next();
  }
  
  // For paths without trailing slash, add it
  // Check if request is forwarded from external domain
  if (xForwardedHost && xForwardedHost !== host) {
    // Extract project name from path (e.g., /mimo/xxx -> mimo)
    const projectMatch = pathname.match(/^\/([^\/]+)/);
    if (projectMatch) {
      const project = projectMatch[1];
      const restPath = pathname.substring(project.length + 1);
      
      // Map to correct external domain
      const projectMappings: Record<string, string> = {
        'iotex': 'https://iotex.io/blog',
        'mimo': 'https://mimo.exchange/blog',
      };
      
      if (projectMappings[project]) {
        const externalUrl = `${projectMappings[project]}${restPath}/`;
        console.log(`[Middleware] External redirect: ${pathname} -> ${externalUrl}`);
        return NextResponse.redirect(externalUrl, 301);
      }
    }
  }
  
  // For direct access to unipost domain, redirect with trailing slash
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