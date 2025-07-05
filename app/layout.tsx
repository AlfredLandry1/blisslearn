import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers";
import { StructuredData } from "@/components/ui/structured-data";
import { SkipLinks, defaultSkipLinks } from "@/components/ui/skip-links";
import { PWAInstallPrompt } from "@/components/ui/pwa-install-prompt";
import { PerformanceMonitor } from "@/components/ui/performance-monitor";
import { ErrorBoundary } from "@/components/ui/error-boundary";
import { GoogleAnalytics } from "@/components/ui/analytics";

export const metadata: Metadata = {
  title: {
    default: "BlissLearn - Plateforme d'Apprentissage Intelligente",
    template: "%s | BlissLearn"
  },
  description: "Découvrez BlissLearn, la plateforme d'apprentissage intelligente qui révolutionne l'éducation avec l'IA. Cours personnalisés, recommandations adaptatives et expérience d'apprentissage immersive pour tous les niveaux.",
  keywords: [
    "apprentissage",
    "éducation",
    "cours en ligne",
    "intelligence artificielle",
    "formation",
    "développement personnel",
    "compétences",
    "apprentissage adaptatif",
    "plateforme éducative",
    "cours personnalisés"
  ],
  authors: [{ name: "BlissLearn Team" }],
  creator: "BlissLearn",
  publisher: "BlissLearn",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://styland-digital-blisslearn.vercel.app/'),
  alternates: {
    canonical: '/',
  },
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/favicon.ico', sizes: 'any' }
    ],
    apple: '/apple-touch-icon.png',
  },
  manifest: '/manifest.json',
  openGraph: {
    type: "website",
    locale: "fr_FR",
    url: "https://styland-digital-blisslearn.vercel.app/",
    title: "BlissLearn - Plateforme d'Apprentissage Intelligente",
    description: "Découvrez BlissLearn, la plateforme d'apprentissage intelligente qui révolutionne l'éducation avec l'IA. Cours personnalisés, recommandations adaptatives et expérience d'apprentissage immersive.",
    siteName: "BlissLearn",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "BlissLearn - Plateforme d'Apprentissage Intelligente",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "BlissLearn - Plateforme d'Apprentissage Intelligente",
    description: "Découvrez BlissLearn, la plateforme d'apprentissage intelligente qui révolutionne l'éducation avec l'IA.",
    images: ["/og-image.png"],
    creator: "@blisslearn",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "votre-code-verification-google",
    yandex: "votre-code-verification-yandex",
    yahoo: "votre-code-verification-yahoo",
  },
  category: "education",
  classification: "Educational Technology",
  other: {
    "mobile-web-app-capable": "yes",
    "apple-mobile-web-app-status-bar-style": "default",
    "apple-mobile-web-app-title": "BlissLearn",
    "application-name": "BlissLearn",
    "msapplication-TileColor": "#3B82F6",
    "msapplication-config": "/browserconfig.xml",
    "theme-color": "#3B82F6",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              // Optimisation du chargement des polices
              if (document.fonts && document.fonts.ready) {
                document.fonts.ready.then(() => {
                  document.documentElement.classList.add('fonts-loaded');
                });
              }
              
              // Service Worker
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/sw.js')
                    .then(function(registration) {
                      console.log('SW registered: ', registration);
                    })
                    .catch(function(registrationError) {
                      console.log('SW registration failed: ', registrationError);
                    });
                });
              }
            `,
          }}
        />
      </head>
                    <body className="font-sans">
        <ErrorBoundary>
          <SkipLinks links={defaultSkipLinks} />
          <Providers>
            {children}
            <StructuredData type="website" />
            <StructuredData type="organization" />
            <PWAInstallPrompt />
            <PerformanceMonitor />
            <GoogleAnalytics />
          </Providers>
        </ErrorBoundary>
      </body>
    </html>
  );
}
