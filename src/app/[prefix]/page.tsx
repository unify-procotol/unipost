import { getProject } from "@/lib/data";
import { notFound } from "next/navigation";

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

    // Redirect to English if available, otherwise first available locale
    const defaultLocale = project.locales.includes('en') ? 'en' : project.locales[0];
    if (defaultLocale) {
      const redirectUrl = `/${prefix}/${defaultLocale}`;
      return (
        <html>
          <head>
            <meta httpEquiv="refresh" content={`0; url=${redirectUrl}`} />
            <script dangerouslySetInnerHTML={{
              __html: `window.location.href = '${redirectUrl}';`
            }} />
          </head>
          <body>
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              minHeight: '100vh',
              fontFamily: 'system-ui, sans-serif'
            }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{
                  width: '32px',
                  height: '32px',
                  border: '3px solid #f3f3f3',
                  borderTop: '3px solid #3498db',
                  borderRadius: '50%',
                  animation: 'spin 1s linear infinite',
                  margin: '0 auto 16px'
                }} />
                <p style={{ color: '#666', margin: 0 }}>Redirecting...</p>
                <style dangerouslySetInnerHTML={{
                  __html: `
                    @keyframes spin {
                      0% { transform: rotate(0deg); }
                      100% { transform: rotate(360deg); }
                    }
                  `
                }} />
              </div>
            </div>
          </body>
        </html>
      );
    } else {
      notFound();
    }
  } catch (error) {
    console.error("Error loading project:", error);
    notFound();
  }
}
