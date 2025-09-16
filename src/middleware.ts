import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const host = request.headers.get('host') || '';
  
  console.log(`[Middleware] Host: ${host}, Path: ${pathname}`);
  
  // 跳过静态文件和API路由
  if (
    pathname.includes('.') || 
    pathname.startsWith('/api') || 
    pathname.startsWith('/_next') ||
    pathname === '/'
  ) {
    return NextResponse.next();
  }
  
  // 如果路径已经有尾随斜杠，正常渲染页面，不做任何处理
  if (pathname.endsWith('/')) {
    console.log(`[Middleware] Path has trailing slash, render page normally: ${pathname}`);
    return NextResponse.next();
  }
  
  // 仅在unipost域名上处理没有尾随斜杠的路径
  if (host.includes('unipost')) {
    // 从路径中提取项目名称（例如：/iotex/article -> iotex）
    const pathParts = pathname.split('/').filter(Boolean);
    
    if (pathParts.length > 0) {
      const project = pathParts[0];
      
      // 项目到原始域名的映射
      const projectDomains: Record<string, { domain: string; blogPath: string }> = {
        'iotex': { domain: 'https://iotex.io', blogPath: '/blog' },
        'mimo': { domain: 'https://mimo.exchange', blogPath: '/blog' },
      };
      
      // 如果是已知项目且路径是文章路径（有多个路径段）
      if (projectDomains[project] && pathParts.length > 1) {
        // 移除项目前缀并构建新路径
        const restPath = pathParts.slice(1).join('/');
        const { domain, blogPath } = projectDomains[project];
        
        // 构建带有/blog前缀和尾随斜杠的重定向URL
        const redirectUrl = `${domain}${blogPath}/${restPath}/`;
        
        console.log(`[Middleware] 301 Redirect (no trailing slash): ${pathname} -> ${redirectUrl}`);
        return NextResponse.redirect(redirectUrl, 301);
      }
    }
    
    // 对于unipost域名上的其他没有尾随斜杠的路径，添加尾随斜杠
    const url = request.nextUrl.clone();
    url.pathname = `${pathname}/`;
    console.log(`[Middleware] Adding trailing slash locally: ${pathname} -> ${url.pathname}`);
    return NextResponse.redirect(url, 301);
  }
  
  // 对于非unipost域名，正常处理
  return NextResponse.next();
}

export const config = {
  matcher: [
    // 匹配所有路径，除了：
    // - api 路由
    // - _next/static（静态文件）
    // - _next/image（图片优化文件）
    // - favicon.ico（网站图标）
    // - 其他静态资源文件
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).+)'
  ],
};