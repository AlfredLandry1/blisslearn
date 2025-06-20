import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

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
  metadataBase: new URL('https://blisslearn.com'),
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
    url: "https://blisslearn.com",
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
      <body className={inter.className}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
