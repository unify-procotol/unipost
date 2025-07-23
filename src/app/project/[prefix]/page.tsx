import { getProject } from "@/lib/data";
import { redirect, notFound } from "next/navigation";

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ prefix: string }>;
}) {
  const { prefix } = await params;

  try {
    const project = await getProject(prefix);

    if (!project) {
      notFound();
    }

    // Redirect to the first available locale
    const defaultLocale = project.locales[0];
    if (defaultLocale) {
      redirect(`/project/${prefix}/${defaultLocale}/posts`);
    } else {
      notFound();
    }
  } catch (error) {
    console.error("Error loading project:", error);
    notFound();
  }
}
