"use client";

import { useRouter } from "next/navigation";
import { PublicProjectEntity } from "@/entities/public-project";
import Container from "./ui/container";
import SubscribeButton from "./subscribe-button";

interface ProjectSelectorProps {
  projects: PublicProjectEntity[];
}

export default function ProjectSelector({ projects }: ProjectSelectorProps) {
  const router = useRouter();

  const handleProjectClick = (project: PublicProjectEntity) => {
    // Get the first language as default locale
    const defaultLocale = project.locales[0];
    if (defaultLocale) {
      router.push(`/project/${project.prefix}/${defaultLocale}/posts`);
    }
  };

  const getProjectIcon = (name: string) => {
    return name.charAt(0).toUpperCase();
  };

  const getStatusColor = (locales: string[]) => {
    if (locales.length === 0) return "bg-gray-500/20 text-gray-300 border-gray-500/30";
    if (locales.length === 1) return "bg-yellow-500/20 text-yellow-300 border-yellow-500/30";
    return "bg-green-500/20 text-green-300 border-green-500/30";
  };

  const getStatusText = (locales: string[]) => {
    if (locales.length === 0) return "No languages";
    if (locales.length === 1) return "Single language";
    return `${locales.length} languages`;
  };

  return (
    <Container className="py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Projects</h1>
        <p className="text-gray-400">Manage your multilingual content projects</p>
      </div>

      {projects.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-white mb-2">No projects yet</h3>
          <p className="text-gray-400">Create your first project to get started with multilingual content management.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <div
              key={project.id}
              onClick={() => handleProjectClick(project)}
              className="bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-700/50 p-6 cursor-pointer hover:border-gray-600/50 hover:transform hover:scale-105 transition-all duration-300 group"
            >
              {/* Project Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold text-lg">
                    {getProjectIcon(project.name)}
                  </div>
                  <div>
                    <h3 className="font-semibold text-white group-hover:text-blue-300 transition-colors">
                      {project.name}
                    </h3>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(project.locales)}`}>
                      {getStatusText(project.locales)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Project Details */}
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-400 mb-1">Ghost Domain</p>
                  <p className="text-sm text-gray-300 truncate">{project.ghost_domain}</p>
                </div>

                {project.locales.length > 0 && (
                  <div>
                    <p className="text-sm text-gray-400 mb-2">Supported Languages</p>
                    <div className="flex flex-wrap gap-1">
                      {project.locales.slice(0, 4).map((locale, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-gray-700/50 text-gray-300 border border-gray-600/50"
                        >
                          {locale.toUpperCase()}
                        </span>
                      ))}
                      {project.locales.length > 4 && (
                        <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-gray-700/50 text-gray-300 border border-gray-600/50">
                          +{project.locales.length - 4}
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="mt-4 pt-4 border-t border-gray-700/50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center text-sm text-gray-400 group-hover:text-blue-300 transition-colors">
                    <span>View posts</span>
                    <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                  <div onClick={(e) => e.stopPropagation()}>
                    <SubscribeButton
                      project={project}
                      locale={project.locales[0] || 'en'}
                      variant="outline"
                      size="sm"
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </Container>
  );
}
