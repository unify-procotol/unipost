import { CreationArgs } from "@unilab/urpc-core";
import { ProjectEntity } from "../entities/project";
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
      const rows = ghostPosts.map((ghostPost) => ({
        title: ghostPost.title,
        content: ghostPost.html ?? "",
        project_id: project.id,
        status: "pending",
        data: ghostPost as unknown as Record<string, unknown>,
      })).filter((row) => row.content.length < 10000);
      await post.batchIns(rows, ['title']);
      return project;
    }

    const result = await super.create(args);

    const ghostPosts = await getPosts(result.ghost_api_key, result.ghost_domain);
    const post = new PostAdapter();
    for (const ghostPost of ghostPosts) {
      if (ghostPost.html?.length && ghostPost.html.length < 10000) {
        await post.create({
          data: {
            title: ghostPost.title,
            content: ghostPost.html ?? "",
            project_id: result.id,
            status: "pending",
            data: ghostPost as unknown as Record<string, unknown>,
          },
        });
      }
    }
    return result;
  }
}
