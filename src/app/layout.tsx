import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ModalProvider } from "@/contexts/modal-context";
import PerformanceMonitor from "@/components/seo/performance-monitor";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export const metadata: Metadata = {
  title: {
    default: "UniPost - Multilingual Content Management Platform",
    template: "%s"
  },
  description: "UniPost is a powerful multilingual content management platform that integrates with Ghost CMS and provides AI-powered translation services for seamless global content distribution.",
// keywords: ["multilingual", "content management", "Ghost CMS", "AI translation", "blog", "internationalization", "i18n"],
  robots: {
    index: false,
    follow: false,
    noarchive: true,
    nosnippet: true,
    noimageindex: true,
    nocache: true,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "UniPost",
    title: "UniPost - Multilingual Content Management Platform",
    description: "Powerful multilingual content management with Ghost CMS integration and AI translation",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "UniPost - Multilingual Content Management Platform",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "UniPost - Multilingual Content Management Platform",
    description: "Powerful multilingual content management with Ghost CMS integration and AI translation",
    images: ["/og-image.png"],
  },
  verification: {
    google: "your-google-verification-code",
  },
  metadataBase: new URL("https://unipost.uni-labs.org"),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="manifest" href="/manifest.json" />
        {/* <link rel="apple-touch-icon" href="/apple-touch-icon.png" /> */}
        <meta name="theme-color" content="#3B82F6" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="UniPost" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen bg-gray-50`}
      >
        <ModalProvider>
          <PerformanceMonitor />
          {children}
        </ModalProvider>
      </body>
    </html>
  );
}
