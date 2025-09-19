// Helper functions to generate breadcrumb items for different page types

interface BreadcrumbItem {
  label: string;
  href?: string;
  current?: boolean;
}

export function generateProjectPostsBreadcrumbs(projectName: string): BreadcrumbItem[] {
  return [
    { label: 'Home', href: '/' },
    { label: projectName,  current: true },
  ];
}

export function generatePostDetailBreadcrumbs(projectName: string, postTitle: string, slug: string, referer: string, locale?: string, projectPrefix?: string): BreadcrumbItem[] {
  // Extract the path without the slug from referer
  let projectHref = '/';
  
  if (referer) {
    try {
      const url = new URL(referer);
      const origin = url.origin;
      
      // Detect if we're in a rewrite environment (actual project domain)
      const isLocalhost = origin.includes("localhost");
      const isUniLabsOrg = origin.includes("unipost.uni-labs.org");
      const isRenderTest = origin.includes("unipost-test-only.onrender.com");
      const isDirectAccess = isLocalhost || isUniLabsOrg || isRenderTest;
      
      if (isDirectAccess) {
        // Direct access: use project prefix format
        if (locale && locale !== "en" && projectPrefix) {
          projectHref = `/${locale}/${projectPrefix}/`;
        } else if (projectPrefix) {
          projectHref = `/${projectPrefix}/`;
        } else {
          projectHref = '/';
        }
      } else {
        // Rewrite environment: use /blog format
        if (locale && locale !== "en") {
          projectHref = `/${locale}/blog/`;
        } else {
          projectHref = '/blog/';
        }
      }
    } catch (error) {
      // If URL parsing fails, fallback
      projectHref = '/';
    }
  }
  
  return [
    { label: 'Home', href: '/' },
    { label: projectName, href: projectHref },
    { label: postTitle, current: true },
  ];
}