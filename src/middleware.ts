import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const host = request.headers.get('host') || '';
  
  console.log(`[Middleware] Host: ${host}, Path: ${pathname}`);
  
  // Define project mappings for external redirects
  const projectMappings: Record<string, string> = {
    'iotex': 'https://iotex.io/blog',
    'mimo': 'https://mimo.exchange/blog', 
  };
  
  // Only process requests to unipost domain
  if (host === 'unipost.uni-labs.org' || host.includes('unipost')) {
    
    // Skip paths with trailing slash - they should render normally
    if (pathname.endsWith('/')) {
      console.log(`[Middleware] Path has trailing slash, render normally: ${pathname}`);
      return NextResponse.next();
    }
    
    // Match paths like /project/article (no trailing slash)
    const articleMatch = pathname.match(/^\/([^\/]+)\/(.+)$/);
    
    if (articleMatch) {
      const [, project, slug] = articleMatch;
      
      if (projectMappings[project]) {
        const externalUrl = `${projectMappings[project]}/${slug}/`;
        console.log(`[Middleware] Redirecting no-slash path: ${pathname} -> ${externalUrl}`);
        return NextResponse.redirect(externalUrl, 301);
      }
    }
    
    console.log(`[Middleware] No redirect needed for: ${pathname}`);
  } else {
    console.log(`[Middleware] External host, skipping: ${host}`);
  }
  
  return NextResponse.next();
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