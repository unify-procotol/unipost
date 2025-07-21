import { MetadataRoute } from 'next';
import { getProjects, getPosts } from '@/lib/data';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://unipost.app';
  
  try {
    const projects = await getProjects();
    const sitemap: MetadataRoute.Sitemap = [];

    // Add homepage
    sitemap.push({
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    });

    // Add project pages for each locale
    for (const project of projects) {
      for (const locale of project.locales) {
        // Project posts list page
        sitemap.push({
          url: `${baseUrl}/${locale}/project/${project.id}/posts`,
          lastModified: new Date(project.updated_at || project.created_at || new Date().toISOString()),
          changeFrequency: 'daily',
          priority: 0.8,
        });

        try {
          // Get posts for this project and add individual post pages
          const posts = await getPosts(project.id.toString());
          
          for (const post of posts) {
            sitemap.push({
              url: `${baseUrl}/${locale}/project/${project.id}/posts/${post.id}`,
              lastModified: new Date(post.updated_at || post.created_at || new Date().toISOString()),
              changeFrequency: 'weekly',
              priority: 0.6,
            });
          }
        } catch (error) {
          console.error(`Error fetching posts for project ${project.id}:`, error);
        }
      }
    }

    return sitemap;
  } catch (error) {
    console.error('Error generating sitemap:', error);
    
    // Return minimal sitemap if there's an error
    return [
      {
        url: baseUrl,
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: 1,
      },
    ];
  }
}
