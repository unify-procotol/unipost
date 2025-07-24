// Helper functions to generate breadcrumb items for different page types

interface BreadcrumbItem {
  label: string;
  href?: string;
  current?: boolean;
}

export function generateProjectPostsBreadcrumbs(projectName: string, prefix: string, locale: string): BreadcrumbItem[] {
  return [
    { label: 'Home', href: '/' },
    { label: projectName, href: `/project/${prefix}/${locale}/posts` },
    { label: 'Posts', current: true },
  ];
}

export function generatePostDetailBreadcrumbs(projectName: string, prefix: string, locale: string, postTitle: string): BreadcrumbItem[] {
  return [
    { label: 'Home', href: '/' },
    { label: projectName, href: `/project/${prefix}/${locale}/posts` },
    { label: 'Posts', href: `/project/${prefix}/${locale}/posts` },
    { label: postTitle, current: true },
  ];
}