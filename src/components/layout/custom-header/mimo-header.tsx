import Link from "next/link";
import Image from "next/image";
import { PublicProjectEntity } from "@/entities/public-project";
import HeaderLanguageSwitcher from "../../header-language-switcher";
import SubscribeButton from "../../subscribe-button";

interface MimoHeaderProps {
  project?: PublicProjectEntity | null;
  locale?: string;
  isPostDetail?: boolean;
}
const test = {
  nav: [
    { link: "https://mimo.exchange/", name: "Home" },
    { link: "https://mimo.finance/", name: "About" },
    { link: "https://mimo.finance/#faq", name: "FAQ" },
    { link: "https://docs.mimo.finance/", name: "Docs" },
    { link: "https://mimo.exchange/swap", name: "Enter App" },
  ],
};
export default function MimoHeader({
  project,
  locale = "en",
  isPostDetail = false,
}: MimoHeaderProps) {
  return (
    <div
      className="relative overflow-hidden"
      style={{ backgroundColor: "#00E100" }}
    >
      {/* Background Image - Only show if not in post detail */}
      {!isPostDetail && (
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: "url(/images/mimo_header.png)" }}
        ></div>
      )}

      <div
        className={`relative z-10 flex flex-col h-full ${
          isPostDetail ? "min-h-[64px]" : "min-h-[670px]"
        }`}
      >
        {/* Top Navigation */}
        <header className="px-4 sm:px-6 lg:px-8 py-4">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between h-16">
              {/* Left: Logo and Navigation */}
              <div className="flex items-center space-x-8">
                {/* Logo and Brand - Only show in post detail with mimo logo */}
                {isPostDetail && (
                  <Link href="/" className="flex items-center space-x-2">
                    <Image
                      src="/images/mimo_logo.png"
                      alt="Mimo Logo"
                      width={120}
                      height={36}
                      className="max-h-[36px] w-auto"
                    />
                  </Link>
                )}

                {/* Navigation */}
                <nav className="hidden md:flex items-center space-x-4">
                  {/* Only show Projects link when not in a project */}
                  {!project && (
                    <Link
                      href="/"
                      className="px-3 py-2 rounded-md text-md font-medium transition-colors text-white hover:bg-white/10"
                    >
                      Projects
                    </Link>
                  )}

                  {/* Custom Project Navigation */}
                  {project?.config?.nav && project.config.nav.length > 0 && (
                    <>
                      {project.config.nav.map((navItem, index) =>
                        navItem.name && navItem.link ? (
                          <a
                            key={index}
                            href={navItem.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-3 py-2 rounded-md text-md font-medium transition-colors text-white hover:bg-white/10"
                          >
                            {navItem.name}
                          </a>
                        ) : null
                      )}
                    </>
                  )}
                </nav>
              </div>

              {/* Right: User Actions */}
              <div className="flex items-center space-x-4">
                {project?.has_subscription && (
                  <SubscribeButton
                    project={project}
                    locale={locale}
                    variant="outline"
                    size="sm"
                    className="bg-white text-green-500 hover:bg-gray-100 border-white"
                  />
                )}
                <div className="[&>*]:text-white [&_button]:text-white [&_select]:text-white">
                  <HeaderLanguageSwitcher />
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Main Hero Section - Only show if not in post detail */}
        {!isPostDetail && (
          <div className="flex-1 flex items-center justify-center text-center px-4">
            <div className="max-w-4xl mx-auto">
              {/* Main Logo */}
              <div className="flex items-center justify-center mb-6">
                <Image
                  src="/images/mimo_logo.png"
                  alt="Mimo Logo"
                  width={400}
                  height={120}
                  className="max-h-[120px] w-auto"
                  priority
                />
              </div>

              {/* Tagline */}
              <p className="text-white/90 text-xl text-[24px]">
                Thoughts, stories and ideas.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
