import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Only handle paths that match our project structure
  // e.g., /iotex/article-slug or /mimo/article-slug (without trailing slash)
  const pathMatch = pathname.match(/^\/([^\/]+)\/([^\/]+)$/);
  const localePathMatch = pathname.match(/^\/([^\/]+)\/(en|zh|es|fr|de|ja|ko|vi|pt|id)\/([^\/]+)$/);
  
  // Handle article paths without trailing slash
  if (pathMatch) {
    const [, prefix, slug] = pathMatch;
    // Only redirect if it's likely an article (not a locale path)
    const locales = ['en', 'zh', 'es', 'fr', 'de', 'ja', 'ko', 'vi', 'pt', 'id'];
    if (!locales.includes(slug)) {
      const newUrl = new URL(pathname + '/', request.url);
      return NextResponse.redirect(newUrl, 301);
    }
  }
  
  // Handle locale article paths without trailing slash  
  if (localePathMatch) {
    const newUrl = new URL(pathname + '/', request.url);
    return NextResponse.redirect(newUrl, 301);
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
    // - paths that already end with /
    '/((?!api|_next/static|_next/image|favicon.ico).*[^/])$'
  ],
};