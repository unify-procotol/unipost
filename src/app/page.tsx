import { getProjects } from "@/lib/data";
import dynamic from "next/dynamic";
import MainLayout from "@/components/layout/main-layout";
import StructuredData from "@/components/seo/structured-data";
import type { Metadata } from "next";

const ProjectSelector = dynamic(() => import("@/components/project-selector"), {
  loading: () => (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-gray-600">Loading projects...</p>
      </div>
    </div>
  )
});

export const metadata: Metadata = {
  title: "Projects Dashboard",
  description: "Manage your multilingual content projects with UniPost. Create, organize, and translate your content across multiple languages with Ghost CMS integration.",
// keywords: ["projects", "multilingual", "content management", "dashboard", "Ghost CMS", "translation"],
  openGraph: {
    title: "Projects Dashboard - UniPost",
    description: "Manage your multilingual content projects with UniPost. Create, organize, and translate your content across multiple languages.",
    type: "website",
  },
  twitter: {
    title: "Projects Dashboard - UniPost",
    description: "Manage your multilingual content projects with UniPost. Create, organize, and translate your content across multiple languages.",
  },
};

export default async function Home() {
  try {
    const projects = await getProjects();
    return (
      <MainLayout>
        <StructuredData type="website" data={{}} />
        <StructuredData type="organization" data={{}} />
        <ProjectSelector projects={projects} />
      </MainLayout>
    );
  } catch {
    return (
      <MainLayout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-white mb-3">Failed to load projects</h3>
            <p className="text-gray-400">Please try refreshing the page or contact support if the issue persists.</p>
          </div>
        </div>
      </MainLayout>
    );
  }
}
