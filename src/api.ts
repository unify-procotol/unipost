import { Logging } from "@unilab/urpc-core/middleware";
import { URPC } from "@unilab/urpc-next/app-router";
import { Plugin } from "@unilab/urpc-core";
import { ProjectEntity } from "./entities/project";
import { PostEntity } from "./entities/post";
import { ProjectAdapter } from "./adapters/project";
import { PostAdapter } from "./adapters/post";
import { gptTranslation } from "./lib/i18n";

const UnipostPlugin: Plugin = {
  entities: [ProjectEntity, PostEntity],
  adapters: [
    {
      source: "postgres",
      entity: "ProjectEntity",
      adapter: new ProjectAdapter(),
    },
    {
      source: "postgres",
      entity: "PostEntity",
      adapter: new PostAdapter(),
    },
  ],

};

export async function process() {
  const postEntity = new PostAdapter();
  const projectEntity = new ProjectAdapter();

  const pendingPosts = await postEntity.findOne({
    where: {
      status: "pending",
    },
  });

  if (!pendingPosts) {
    return;
  }

  const project = await projectEntity.findOne({
    where: {
      id: pendingPosts.project_id,
    },
  });

  const i18n = await gptTranslation(
    pendingPosts.title,
    pendingPosts.content,
    project?.locales || []
  );

  await postEntity.update({
    where: {
      id: pendingPosts.id,
    },
    data: {
      i18n, 
      status: "translated",
    },
  });
}

export const api = URPC.init({
  plugins: [UnipostPlugin],
  middlewares: [Logging()],
  entityConfigs: {
    project: {
      defaultSource: "postgres",
    },
    post: {
      defaultSource: "postgres", 
    },
  },
});
