import { CreationArgs } from "@unilab/urpc-core";
import { ProjectEntity } from "../entities/project";
import { PostEntity } from "../entities/post";
import { PostgresAdapter, PostgresAdapterConfig } from "./postgres";
import { PostAdapter } from "./post";
import { getPosts } from "@/lib/ghost";

export class ProjectAdapter extends PostgresAdapter<ProjectEntity> {
  constructor(config: Omit<PostgresAdapterConfig, 'tableName'> = {}) {
    super({
      ...config,
      tableName: 'projects'
    });
  }

  async create(args: CreationArgs<ProjectEntity>): Promise<ProjectEntity> {

    const project = await this.findOne({
      where: {
        ghost_domain: args.data.ghost_domain,
        ghost_api_key: args.data.ghost_api_key,
      },
    });
    if (project) {
      const ghostPosts = await getPosts(project.ghost_api_key, project.ghost_domain);
      const post = new PostAdapter();
      const rows = ghostPosts.map((ghostPost) => {
        const entity = new PostEntity();
        entity.title = ghostPost.title || "";
        entity.content = ghostPost.html ?? "";
        entity.project_id = project.id;
        entity.status = "pending";
        entity.data = ghostPost as unknown as Record<string, unknown>;
        entity.slug = ghostPost.slug || "";
        entity.created_at = new Date().toISOString();
        entity.updated_at = new Date().toISOString();
        return entity;
      }).filter((row) => row.content.length < 10000);
      await post.batchIns(rows, ['title']);
      return project;
    }

    const result = await super.create(args);

    const ghostPosts = await getPosts(result.ghost_api_key, result.ghost_domain);
    const post = new PostAdapter();
    for (const ghostPost of ghostPosts) {
      if (ghostPost.html?.length && ghostPost.html.length < 10000) {
        const entity = new PostEntity();
        entity.title = ghostPost.title || "";
        entity.content = ghostPost.html ?? "";
        entity.project_id = result.id;
        entity.status = "pending";
        entity.data = ghostPost as unknown as Record<string, unknown>;
        entity.slug = ghostPost.slug || "";
        entity.created_at = new Date().toISOString();
        entity.updated_at = new Date().toISOString();

        await post.create({
          data: entity,
        });
      }
    }
    return result;
  }
}
