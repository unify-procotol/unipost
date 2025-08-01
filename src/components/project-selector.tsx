"use client";

import { useRouter } from "next/navigation";
import { PublicProjectEntity } from "@/entities/public-project";
import Container from "./ui/container";
import SubscribeButton from "./subscribe-button";
import Image from "next/image";

interface ProjectSelectorProps {
  projects: PublicProjectEntity[];
}

export default function ProjectSelector({ projects }: ProjectSelectorProps) {
  const router = useRouter();

  const handleProjectClick = (project: PublicProjectEntity) => {
    // Get the first language as default locale
    const defaultLocale = project.locales[0];
    if (defaultLocale) {
      router.push(`/${project.prefix}/${defaultLocale}`);
    }
  };

  const getProjectIcon = (name: string) => {
    return name.charAt(0).toUpperCase();
  };

  // Method to get project logo based on prefix
  const getProjectLogo = (project: PublicProjectEntity) => {
    const logoConfig = {
      mimo: {
        src: "/images/mimo_single_logo.svg",
        width: 40,
        height: 40,
        className: "w-10 h-10 object-contain"
      },
      iotex: {
        src: "/images/iotex_logo.svg",
        width: 48,
        height: 48,
        className: "w-12 h-12 object-contain"
      },
      depinscan: {
        src: "/images/depinscan_logo.svg",
        width: 40,
        height: 40,
        className: "w-10 h-10 object-contain"
      }
    };

    const logoConfig_item = logoConfig[project.prefix as keyof typeof logoConfig];
    
    if (logoConfig_item) {
      return (
        <Image
          src={logoConfig_item.src}
          alt={`${project.name} Logo`}
          width={logoConfig_item.width}
          height={logoConfig_item.height}
          className={logoConfig_item.className}
        />
      );
    }

    // Fallback to default icon with first letter
    return (
      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold text-lg">
        {getProjectIcon(project.name)}
      </div>
    );
  };

  const getStatusColor = (locales: string[]) => {
    if (locales.length === 0) return "bg-gray-500/20 text-gray-700 border-gray-500/30";
    if (locales.length === 1) return "bg-yellow-500/20 text-yellow-700 border-yellow-500/30";
    return "bg-green-500/20 text-green-700 border-green-500/30";
  };

  const getStatusText = (locales: string[]) => {
    if (locales.length === 0) return "No languages";
    if (locales.length === 1) return "Single language";
    return `${locales.length} languages`;
  };

  return (
    <Container className="py-4 md:py-8">
      <div className="mb-6 md:mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Projects</h1>
        <p className="text-sm md:text-base text-gray-600">Manage your multilingual content projects</p>
      </div>

      {projects.length === 0 ? (
        <div className="text-center py-8 md:py-12 px-4">
          <div className="w-12 h-12 md:w-16 md:h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-6 h-6 md:w-8 md:h-8 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          </div>
          <h3 className="text-base md:text-lg font-medium text-gray-900 mb-2">No projects yet</h3>
          <p className="text-sm md:text-base text-gray-600 max-w-md mx-auto">Create your first project to get started with multilingual content management.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {projects.map((project) => (
            <div
              key={project.id}
              onClick={() => handleProjectClick(project)}
              className="bg-white/80 backdrop-blur-sm rounded-xl md:rounded-2xl border border-gray-300/50 p-4 md:p-6 cursor-pointer hover:border-gray-400/50 transition-all duration-300 group shadow-sm hover:shadow-md active:scale-[0.98] md:active:scale-100"
            >
              {/* Project Header */}
              <div className="flex items-start justify-between mb-3 md:mb-4">
                <div className="flex items-center space-x-3">
                  {getProjectLogo(project)}
                  <div className="min-w-0 flex-1">
                    <h3 className="text-base md:text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors truncate">
                      {project.name}
                    </h3>
                    <span className={`inline-flex items-center px-2 md:px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(project.locales)} mt-1`}>
                      {getStatusText(project.locales)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Project Details */}
              <div className="space-y-2 md:space-y-3">
                <div>
                  <p className="text-xs md:text-sm text-gray-600 mb-1">Ghost Domain</p>
                  <p className="text-sm md:text-sm text-gray-700 truncate break-all">{project.ghost_domain}</p>
                </div>

                {project.locales.length > 0 && (
                  <div>
                    <p className="text-xs md:text-sm text-gray-600 mb-2">Supported Languages</p>
                    <div className="flex flex-wrap gap-1.5">
                      {project.locales.slice(0, 3).map((locale, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-gray-100/80 text-gray-700 border border-gray-300/50"
                        >
                          {locale.toUpperCase()}
                        </span>
                      ))}
                      {project.locales.length > 3 && (
                        <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-gray-100/80 text-gray-700 border border-gray-300/50">
                          +{project.locales.length - 3}
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="mt-3 md:mt-4 pt-3 md:pt-4 border-t border-gray-300/50">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div className="flex items-center text-sm md:text-sm text-gray-600 group-hover:text-blue-600 transition-colors">
                    <span>View posts</span>
                    <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                  <div 
                    onClick={(e) => e.stopPropagation()}
                    className="flex-shrink-0"
                  >
                    <SubscribeButton
                      project={project}
                      locale={project.locales[0] || 'en'}
                      variant="outline"
                      size="sm"
                      className="w-full sm:w-auto min-h-[36px]"
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
