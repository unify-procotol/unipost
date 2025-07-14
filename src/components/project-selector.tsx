"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ProjectEntity } from "@/entities/project";

interface ProjectSelectorProps {
  projects: ProjectEntity[];
}

export default function ProjectSelector({ projects }: ProjectSelectorProps) {
  const router = useRouter();
  const [selectedProject, setSelectedProject] = useState<ProjectEntity | null>(null);

  // 如果选择了项目，显示语言选择器
  if (selectedProject) {
    return (
      <div className="flex flex-col gap-4 p-4">
        <button
          onClick={() => setSelectedProject(null)}
          className="text-blue-500 hover:underline self-start"
        >
          ← 返回项目列表
        </button>
        <div className="text-2xl font-bold">{selectedProject.name}</div>
        <div className="p-4 bg-gray-50 border border-gray-200 rounded-md">
          <p className="mb-4">请选择一种语言查看内容：</p>
          <div className="grid gap-2">
            {Object.entries(selectedProject.locales).map(([key, value]) => (
              <button
                key={key}
                className="bg-white p-4 rounded-md cursor-pointer border border-gray-300 hover:bg-gray-50 text-left"
                onClick={() => {
                  router.push(`/${value}/project/${selectedProject.id}/posts`);
                }}
              >
                {value}
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 p-4">
      <div className="text-2xl font-bold mb-4">项目列表</div>
      {projects.map((project) => (
        <div
          className="bg-gray-50 p-4 rounded-md cursor-pointer hover:bg-gray-100 transition-colors"
          key={project.id}
          onClick={() => setSelectedProject(project)}
        >
          <div className="text-lg font-bold flex justify-between">
            <div>{project.name}</div>
            <div className="text-sm text-gray-500">
              {Object.entries(project.locales).map(([key, value]) => (
                <div key={key}>{value}</div>
              ))}
            </div>
          </div>
          <div className="text-sm text-gray-500">{project.ghost_domain}</div>
        </div>
      ))}
    </div>
  );
}
