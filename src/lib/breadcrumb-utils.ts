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

export function generatePostDetailBreadcrumbs(projectName: string, prefix: string, locale: string, postTitle: string): BreadcrumbItem[] {
  return [
    { label: 'Home', href: '/' },
    { label: projectName, href: `/${prefix}/${locale}` },
    { label: postTitle, current: true },
  ];
}