import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const headers = Object.fromEntries(request.headers.entries());

  // 跳过系统路径和静态文件
  if (
    pathname.startsWith("/_next/") ||
    pathname.startsWith("/api/") ||
    pathname.startsWith("/favicon.ico") ||
    pathname.startsWith("/robots.txt") ||
    pathname.startsWith("/sitemap.xml") ||
    pathname.startsWith("/images/") ||
    pathname.startsWith("/public/") ||
    pathname.includes(".") // 跳过带扩展名的文件
  ) {
    return NextResponse.next();
  }

  console.log("🛠️ Middleware triggered for:", {
    pathname,
    host: headers["host"],
    referer: headers["referer"],
  });

  // 如果pathname是以 / 结尾的，则正常显示页面
  if (pathname.endsWith("/")) {
    return NextResponse.next();
  }

  // 如果不是 / 结尾的并且包含 /iotex，则重定向到 https://w3bstream.com/blog/
  // 但是要检查是否来自 Render 的 rewrite，避免重定向循环
  if (pathname.includes("/iotex")) {
    const host = headers["host"];
    const referer = headers["referer"];
    
    // 如果 referer 来自 w3bstream.com，说明这是 Render rewrite 的结果，不要重定向
    if (referer && referer.includes("w3bstream.com")) {
      console.log("📝 检测到来自 w3bstream.com 的 rewrite，跳过重定向:", {
        pathname,
        host,
        referer,
      });
      return NextResponse.next();
    }
    
    // 否则执行重定向
    let blogPath = pathname.replace("/iotex", "/blog");
    if (!blogPath.endsWith("/")) {
      blogPath += "/";
    }

    // 构建外部URL
    const externalUrl = new URL(blogPath + search, "https://w3bstream.com");

    console.log("🔄 重定向到外部URL:", {
      from: request.url,
      to: externalUrl.toString(),
      referer: headers["referer"],
      reason: "iotex路径重定向到w3bstream.com/blog",
    });

    return NextResponse.redirect(externalUrl, 301);
  }

  // 其他路径保持不变
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
