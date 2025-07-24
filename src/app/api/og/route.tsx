import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';

export const runtime = 'edge';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const title = searchParams.get('title') || 'UniPost';
    const subtitle = searchParams.get('subtitle') || '';
    const theme = searchParams.get('theme') || 'light';

    const isDark = theme === 'dark';
    const bgColor = isDark ? '#0f172a' : '#ffffff';
    const textColor = isDark ? '#f8fafc' : '#1e293b';
    const accentColor = isDark ? '#3b82f6' : '#2563eb';
    const subtitleColor = isDark ? '#94a3b8' : '#64748b';

    return new ImageResponse(
      (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: bgColor,
            backgroundImage: isDark 
              ? 'radial-gradient(circle at 25px 25px, #334155 2px, transparent 0), radial-gradient(circle at 75px 75px, #334155 2px, transparent 0)'
              : 'radial-gradient(circle at 25px 25px, #e2e8f0 2px, transparent 0), radial-gradient(circle at 75px 75px, #e2e8f0 2px, transparent 0)',
            backgroundSize: '100px 100px',
            padding: '80px',
            fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
          }}
        >
          {/* Logo/Brand */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              marginBottom: '40px',
            }}
          >
            <div
              style={{
                width: '60px',
                height: '60px',
                backgroundColor: accentColor,
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: '20px',
              }}
            >
              <svg
                width="32"
                height="32"
                viewBox="0 0 24 24"
                fill="white"
              >
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="white" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <span
              style={{
                fontSize: '32px',
                fontWeight: '700',
                color: accentColor,
              }}
            >
              UniPost
            </span>
          </div>

          {/* Main Title */}
          <h1
            style={{
              fontSize: title.length > 50 ? '48px' : '64px',
              fontWeight: '800',
              color: textColor,
              textAlign: 'center',
              lineHeight: '1.1',
              margin: '0 0 20px 0',
              maxWidth: '900px',
            }}
          >
            {title}
          </h1>

          {/* Subtitle */}
          {subtitle && (
            <p
              style={{
                fontSize: '24px',
                color: subtitleColor,
                textAlign: 'center',
                margin: '0',
                maxWidth: '800px',
                lineHeight: '1.4',
              }}
            >
              {subtitle}
            </p>
          )}

          {/* Decorative Elements */}
          <div
            style={{
              position: 'absolute',
              top: '40px',
              right: '40px',
              width: '120px',
              height: '120px',
              borderRadius: '50%',
              background: `linear-gradient(45deg, ${accentColor}20, ${accentColor}10)`,
            }}
          />
          <div
            style={{
              position: 'absolute',
              bottom: '40px',
              left: '40px',
              width: '80px',
              height: '80px',
              borderRadius: '50%',
              background: `linear-gradient(135deg, ${accentColor}15, ${accentColor}05)`,
            }}
          />
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  } catch (e: unknown) {
    console.error('Error generating OG image:', e);
    const errorMessage = e instanceof Error ? e.message : 'Unknown error';
    return new Response(`Failed to generate the image: ${errorMessage}`, {
      status: 500,
    });
  }
}