import GhostContentAPI from "@tryghost/content-api";
import { getProjectWithSecrets } from "./data";

export async function getPosts(ghost_api_key: string, ghost_domain: string) {
  const api = new GhostContentAPI({
    url: ghost_domain,
    key: ghost_api_key,
    version: "v4.0",
  });

  return api.posts.browse({
    limit: "all",
    include: "tags",
    order: "published_at DESC",
  });
}

export async function getGhostPost(projectId: string, slug: string) {
  const project = await getProjectWithSecrets(projectId);
  if (!project) {
    return null;
  }

  const api = new GhostContentAPI({
    url: project.ghost_domain,
    key: project.ghost_api_key,
    version: "v4.0",
  });
  return api.posts.read({slug: slug});
}