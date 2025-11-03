import { useEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import { PublicProjectEntity } from "@/entities/public-project";

interface UseLocaleRedirectProps {
  project?: PublicProjectEntity | null;
  currentLocale?: string;
}

export function useLocaleRedirect({
  project,
  currentLocale = "en",
}: UseLocaleRedirectProps) {
  const pathname = usePathname();
  const router = useRouter();
  const hasRedirected = useRef(false);

  useEffect(() => {
    if (typeof window === "undefined" || !project || hasRedirected.current) {
      return;
    }

    let savedLocale = localStorage.getItem(`locale_preference_${project.prefix}`);
    
    // If savedLocale is not set, check browser language
    if (!savedLocale) {
      const browserLang = navigator.language.split("-")[0]; // Extract "zh" from "zh-CN"
      
      // Check if browser language is in supported locales
      if (project.locales.includes(browserLang)) {
        savedLocale = browserLang;
      } else {
        savedLocale = "en"; // Default to English
      }
    }
    
    if (savedLocale === currentLocale) {
      return;
    }

    if (!project.locales.includes(savedLocale)) {
      return;
    }

    const pathSegments = pathname.split("/").filter(Boolean);
    const firstSegment = pathSegments[0];

    const isOldRouteFormat = project.prefix === firstSegment;
    const isNewRouteFormat = project.locales.includes(firstSegment);
    const isBlogRouteFormat = firstSegment === "blog";
    const isLocalizedBlogFormat =
      pathSegments.length >= 2 &&
      project.locales.includes(firstSegment) &&
      pathSegments[1] === "blog";

    const isInProjectPath =
      isOldRouteFormat ||
      isNewRouteFormat ||
      isBlogRouteFormat ||
      isLocalizedBlogFormat;

    if (!isInProjectPath) {
      return;
    }

    const origin = window.location.origin;
    const isLocalhost = origin.includes("localhost");
    const isUniLabsOrg = origin.includes("unipost.uni-labs.org");
    const isRenderTest = origin.includes("unipost-test-only.onrender.com");
    const isDirectAccess = isLocalhost || isUniLabsOrg || isRenderTest;

    let pageType: "project" | "article" = "project";
    let slug: string | null = null;

    if (isNewRouteFormat) {
      pageType = pathSegments.length === 3 ? "article" : "project";
      slug = pathSegments.length === 3 ? pathSegments[2] : null;
    } else if (isLocalizedBlogFormat) {
      pageType = pathSegments.length === 3 ? "article" : "project";
      slug = pathSegments.length === 3 ? pathSegments[2] : null;
    } else if (isBlogRouteFormat) {
      pageType = pathSegments.length === 2 ? "article" : "project";
      slug = pathSegments.length === 2 ? pathSegments[1] : null;
    } else if (isOldRouteFormat) {
      pageType = pathSegments.length === 2 ? "article" : "project";
      slug = pathSegments.length === 2 ? pathSegments[1] : null;
    }

    let redirectUrl: string;

    if (pageType === "project") {
      if (isDirectAccess) {
        if (savedLocale === "en") {
          redirectUrl = `/${project.prefix}`;
        } else {
          redirectUrl = `/${savedLocale}/${project.prefix}`;
        }
      } else {
        if (savedLocale === "en") {
          redirectUrl = `/blog`;
        } else {
          redirectUrl = `/${savedLocale}/blog`;
        }
      }
    } else {
      if (isDirectAccess) {
        if (savedLocale === "en") {
          redirectUrl = `/${project.prefix}/${slug}`;
        } else {
          redirectUrl = `/${savedLocale}/${project.prefix}/${slug}`;
        }
      } else {
        if (savedLocale === "en") {
          redirectUrl = `/blog/${slug}`;
        } else {
          redirectUrl = `/${savedLocale}/blog/${slug}`;
        }
      }
    }

    if (!redirectUrl.endsWith("/")) {
      redirectUrl += "/";
    }

    const currentQuery = window.location.search.slice(1);
    if (currentQuery) {
      redirectUrl += `?${currentQuery}`;
    }

    hasRedirected.current = true;
    router.replace(redirectUrl);
  }, [project, currentLocale, pathname, router]);
}

