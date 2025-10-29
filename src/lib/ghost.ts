import GhostContentAPI from "@tryghost/content-api";
import { getProjectWithSecrets } from "./data";
import postgres from "postgres";

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
export async function updateSinglePostContent(ghost_api_key: string = '1fbd2275d9b6135311cb3fc859', ghost_domain: string = 'https://iotex.io/blog', postId: string = '68fbbe7941f5ab0001b5578e') {
  const db = await postgres(process.env.DATABASE_URL || '');
  const api = new GhostContentAPI({
    url: ghost_domain,
    key: ghost_api_key,
    version: "v4.0",
  });
  
  const post = await api.posts.read({ id: postId })
  // console.log(post.html);

  const postData = await db`select * from posts where  data ->> 'id' = ${postId}`;
  if (!postData[0] || !post.html) {
    console.log('Post not found or html is empty');
    return;
  }
  await db`update posts set content = ${post.html}, i18n = '{}' where id = ${postData[0].id}`;
  console.log('Post updated');
}

// await updateSinglePostContent();
