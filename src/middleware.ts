import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const host = request.headers.get('host') || '';
  const forwarded = request.headers.get('x-forwarded-host') || '';
  
  console.log(`[Middleware] Host: ${host}, X-Forwarded-Host: ${forwarded}, Path: ${pathname}`);
  
  // Define project mappings for external redirects
  const projectMappings: Record<string, string> = {
    'iotex': 'https://iotex.io/blog',
    'mimo': 'https://mimo.exchange/blog', 
  };
  
  // Handle requests that come through external domain rewrites
  // These will have host as unipost.uni-labs.org but need to redirect to external domains
  // Also check x-forwarded-host for proxy setups
  if (host === 'unipost.uni-labs.org' || host.includes('unipost')) {
    // Only handle paths WITHOUT trailing slash to avoid redirect loops
    const pathMatch = pathname.match(/^\/([^\/]+)\/([^\/]+?)\/?$/);
    const localePathMatch = pathname.match(/^\/([^\/]+)\/(en|zh|es|fr|de|ja|ko|vi|pt|id)\/([^\/]+?)\/?$/);
    
    // Handle article paths without trailing slash - redirect to external domain with slash
    if (pathMatch) {
      const [, project, slug] = pathMatch;
      const locales = ['en', 'zh', 'es', 'fr', 'de', 'ja', 'ko', 'vi', 'pt', 'id'];
      
      console.log(`[Middleware] pathMatch found - project: ${project}, slug: ${slug}, hasTrailingSlash: ${pathname.endsWith('/')}`);
      
      if (!pathname.endsWith('/') && !locales.includes(slug) && projectMappings[project]) {
        const externalUrl = `${projectMappings[project]}/${slug}/`;
        console.log(`[Middleware] Redirecting: ${pathname} -> ${externalUrl}`);
        return NextResponse.redirect(externalUrl, 301);
      }
    }
    
    // Handle locale article paths without trailing slash
    if (localePathMatch) {
      const [, project, locale, slug] = localePathMatch;
      
      console.log(`[Middleware] localePathMatch found - project: ${project}, locale: ${locale}, slug: ${slug}, hasTrailingSlash: ${pathname.endsWith('/')}`);
      
      if (!pathname.endsWith('/') && projectMappings[project]) {
        const externalUrl = `${projectMappings[project]}/${locale}/${slug}/`;
        console.log(`[Middleware] Redirecting locale path: ${pathname} -> ${externalUrl}`);
        return NextResponse.redirect(externalUrl, 301);
      }
    }
    
    console.log(`[Middleware] No redirect needed for: ${pathname}`);
  } else {
    console.log(`[Middleware] External host, skipping: ${host}${pathname}`);
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