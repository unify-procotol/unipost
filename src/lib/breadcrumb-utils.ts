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
  // If locale is 'en', don't include it in the path
  // const projectHref = locale === 'en' ? `/${prefix}` : `/${prefix}/${locale}`;
  const projectHref = referer.replace(`/${slug}`, '');
  return [
    { label: 'Home', href: '/' },
    { label: projectName, href: projectHref },
    { label: postTitle, current: true },
  ];
}