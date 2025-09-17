import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const headers = Object.fromEntries(request.headers.entries());

  // 跳过系统路径和静态文件
  if (
    pathname.startsWith('/_next/') ||
    pathname.startsWith('/api/') ||
    pathname.startsWith('/favicon.ico') ||
    pathname.startsWith('/robots.txt') ||
    pathname.startsWith('/sitemap.xml') ||
    pathname.startsWith('/images/') ||
    pathname.startsWith('/public/') ||
    pathname.includes('.') // 跳过带扩展名的文件
  ) {
    return NextResponse.next();
  }

  // 处理 /iotex 路径的重定向到外部 /blog 路径，并规范化URL
  if (pathname.startsWith('/iotex')) {
    let blogPath: string;

    if (pathname === '/iotex/') {
      // 如果已经是 /iotex/，正常渲染页面，不做处理
      return NextResponse.next();
    } else if (pathname === '/iotex') {
      // /iotex -> /blog/
      blogPath = '/blog/';
    } else {
      // 其他 iotex 路径，如 /iotex/page/1 -> /blog/page/1
      blogPath = pathname.replace('/iotex/', '/blog/');
      // 确保以斜杠结尾
      if (!blogPath.endsWith('/')) {
        blogPath += '/';
      }
    }

    // 构建外部URL
    const externalUrl = new URL(blogPath + search, 'https://w3bstream.com');

    console.log('🔄 重定向到外部URL:', {
      from: request.url,
      to: externalUrl.toString(),
      referer: headers['referer'],
      reason: '映射到外部blog路径并规范化URL'
    });

    return NextResponse.redirect(externalUrl, 301);
  }

  // 其他路径保持不变
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};