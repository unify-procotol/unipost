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

export function generatePostDetailBreadcrumbs(projectName: string, postTitle: string, slug: string, referer: string): BreadcrumbItem[] {
  // Extract the path without the slug from referer
  let projectHref = '/';
  
  if (referer) {
    try {
      const url = new URL(referer);
      const pathname = url.pathname;
      
      // Remove the slug from the end of the pathname
      let basePath = pathname.replace(`/${slug}`, '').replace(`/${slug}/`, '/');
      
      // If the path becomes empty or just '/', it means we're at root
      if (!basePath || basePath === '' || basePath === '/') {
        projectHref = '/';
      } else {
        // Ensure the path starts with '/' and ends with '/' for consistency
        if (!basePath.startsWith('/')) {
          basePath = '/' + basePath;
        }
        if (!basePath.endsWith('/')) {
          basePath = basePath + '/';
        }
        projectHref = `${url.origin}${basePath}`;
      }
    } catch (error) {
      // If URL parsing fails, fallback to simple string replacement
      projectHref = referer.replace(`/${slug}`, '').replace(`/${slug}/`, '/');
      if (projectHref === '' || projectHref === referer) {
        projectHref = '/';
      }
    }
  }
  
  return [
    { label: 'Home', href: '/' },
    { label: projectName, href: projectHref },
    { label: postTitle, current: true },
  ];
}