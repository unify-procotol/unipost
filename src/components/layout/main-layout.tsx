import Header from "./header";
import Footer from "./footer";
import { PublicProjectEntity } from "@/entities/public-project";

interface MainLayoutProps {
  children: React.ReactNode;
  className?: string;
  project?: PublicProjectEntity | null;
}

export default function MainLayout({ children, className = "", project }: MainLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <Header project={project} />
      <main className={`flex-1 ${className}`}>
        {children}
      </main>
      <Footer />
    </div>
  );
}
