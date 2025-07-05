import { HomeClient } from "@/components/sections/HomeClient";

// Métadonnées optimisées pour la page d'accueil
export const metadata = {
  title: "BlissLearn - Plateforme d'Apprentissage Intelligente",
  description: "Découvrez BlissLearn, la plateforme d'apprentissage intelligente qui révolutionne l'éducation avec l'IA. Cours personnalisés, recommandations adaptatives et expérience d'apprentissage immersive.",
  keywords: "apprentissage, éducation, cours en ligne, intelligence artificielle, formation, développement personnel",
  openGraph: {
    title: "BlissLearn - Plateforme d'Apprentissage Intelligente",
    description: "Découvrez BlissLearn, la plateforme d'apprentissage intelligente qui révolutionne l'éducation avec l'IA.",
    url: "https://styland-digital-blisslearn.vercel.app",
    siteName: "BlissLearn",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "BlissLearn - Plateforme d'Apprentissage Intelligente",
      },
    ],
    locale: "fr_FR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "BlissLearn - Plateforme d'Apprentissage Intelligente",
    description: "Découvrez BlissLearn, la plateforme d'apprentissage intelligente qui révolutionne l'éducation avec l'IA.",
    images: ["/og-image.png"],
  },
  alternates: {
    canonical: "https://styland-digital-blisslearn.vercel.app",
  },
};

export default function Home() {
  return <HomeClient />;
}
