import { getProjects } from "@/lib/data";
import ProjectSelector from "@/components/project-selector";

export default async function Home() {
  try {
    const projects = await getProjects();
    return <ProjectSelector projects={projects} />;
  } catch {
    return (
      <div className="text-center py-12">
        <p className="text-destructive">Failed to load projects</p>
      </div>
    );
  }
}
