"use client";

import { useProjects } from "@/hooks/use-projects";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const { projects, loading, error, fetchProjects } = useProjects();
  const router = useRouter();

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <p>Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-destructive">{error}</p>
      </div>
    );
  }
  return (
    <div className="flex flex-col gap-4 p-4">
      {projects.map((project) => (
        <div
          className="bg-gray-50 p-4 rounded-md cursor-pointer"
          key={project.id}
          onClick={() => router.push(`/project/${project.id}`)}
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
