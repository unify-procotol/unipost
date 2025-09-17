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

  console.log('🔍 Middleware 执行:', {
    pathname,
    search,
    host: headers['host'],
    'x-forwarded-host': headers['x-forwarded-host'],
    'x-forwarded-proto': headers['x-forwarded-proto'],
    'x-original-host': headers['x-original-host'],
    referer: headers['referer']
  });

  // 检测是否是通过rewrite访问的
  const isRewriteScenario = detectRewriteScenario(pathname, headers);

  if (isRewriteScenario) {
    // 如果是rewrite场景，重定向所有iotex路径到对应的blog路径
    if (pathname.startsWith('/iotex')) {
      let blogPath: string;

      if (pathname === '/iotex/') {
        // /iotex/ -> /blog/
        blogPath = '/blog/';
      } else if (pathname === '/iotex') {
        // /iotex -> /blog/
        blogPath = '/blog/';
      } else {
        // 其他iotex路径，如 /iotex/page/1 -> /blog/page/1
        blogPath = pathname.replace('/iotex/', '/blog/');
        // 确保以斜杠结尾
        if (!blogPath.endsWith('/')) {
          blogPath += '/';
        }
      }

      const externalUrl = new URL(blogPath + search, 'https://w3bstream.com');
      console.log('🔄 重定向rewrite场景到外部URL:', {
        from: request.url,
        to: externalUrl.toString(),
        reason: '映射到外部blog路径并规范化URL'
      });
      return NextResponse.redirect(externalUrl, 301);
    }
  }

  // 其他路径保持不变
  return NextResponse.next();
}

/**
 * 检测是否是通过rewrite访问的
 */
function detectRewriteScenario(pathname: string, headers: Record<string, string>): boolean {
  const host = headers['host'] || '';
  const forwardedHost = headers['x-forwarded-host'] || headers['x-original-host'] || '';

  // 方法1: 检查是否有转发头
  if (forwardedHost && forwardedHost !== host) {
    console.log('🔍 通过转发头检测到rewrite');
    return true;
  }

  // 方法2: 检查路径是否以项目前缀开头
  if (pathname.startsWith('/iotex') || pathname.startsWith('/mimo') || pathname.startsWith('/depinscan')) {
    console.log('🔍 通过路径模式检测到rewrite');
    return true;
  }

  // 方法3: 检查是否在render域名上但不是/blog路径
  const isRenderDomain = host.includes('onrender.com') || host.includes('uni-labs.org');
  const isNotBlogPath = !pathname.startsWith('/blog');
  if (isRenderDomain && isNotBlogPath &&
      (pathname.startsWith('/iotex') || pathname.startsWith('/mimo') || pathname.startsWith('/depinscan'))) {
    console.log('🔍 通过域名和路径组合检测到rewrite');
    return true;
  }

  return false;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};