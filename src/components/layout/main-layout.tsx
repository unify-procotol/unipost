import Header from "./header";
import Footer from "./footer";
import { PublicProjectEntity } from "@/entities/public-project";

interface MainLayoutProps {
  children: React.ReactNode;
  className?: string;
  project?: PublicProjectEntity | null;
  locale?: string;
  isPostDetail?: boolean;
  isRewrite?: boolean;
}

export default function MainLayout({ children, className = "", project, locale, isPostDetail = false, isRewrite = false }: MainLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 via-white to-gray-100">
      <Header project={project} locale={locale} isPostDetail={isPostDetail} isRewrite={isRewrite} />
      <main className={`flex-1 ${className}`}>
        {children}
      </main>
      {!project && <Footer />}
    </div>
  );
}
