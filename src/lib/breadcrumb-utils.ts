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
    // Remove the slug from the end of the referer path
    projectHref = referer.replace(`/${slug}`, '');
    // If referer was just the slug, fallback to root
    if (projectHref === '') {
      projectHref = '/';
    }
  }
  
  return [
    { label: 'Home', href: '/' },
    { label: projectName, href: projectHref },
    { label: postTitle, current: true },
  ];
}