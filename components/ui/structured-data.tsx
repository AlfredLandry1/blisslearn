"use client";

interface StructuredDataProps {
  type: "website" | "course" | "organization";
  data?: any;
}

export function StructuredData({ type, data }: StructuredDataProps) {

  const getStructuredData = () => {
    switch (type) {
      case "website":
        return {
          "@context": "https://schema.org",
          "@type": "WebSite",
          "name": "BlissLearn",
          "description": "Plateforme d'apprentissage intelligente avec IA pour des cours personnalisés",
          "url": "https://styland-digital-blisslearn.vercel.app",
          "potentialAction": {
            "@type": "SearchAction",
            "target": "https://styland-digital-blisslearn.vercel.app/dashboard/explorer?q={search_term_string}",
            "query-input": "required name=search_term_string"
          },
          "publisher": {
            "@type": "Organization",
            "name": "BlissLearn",
            "logo": {
              "@type": "ImageObject",
              "url": "https://styland-digital-blisslearn.vercel.app/favicon.svg"
            }
          }
        };

      case "organization":
        return {
          "@context": "https://schema.org",
          "@type": "Organization",
          "name": "BlissLearn",
          "url": "https://styland-digital-blisslearn.vercel.app",
          "logo": "https://styland-digital-blisslearn.vercel.app/favicon.svg",
          "description": "Plateforme d'apprentissage intelligente révolutionnant l'éducation avec l'IA",
          "foundingDate": "2024",
          "sameAs": [
            "https://twitter.com/blisslearn"
          ],
          "contactPoint": {
            "@type": "ContactPoint",
            "contactType": "customer service",
            "email": "contact@blisslearn.com"
          }
        };

      case "course":
        if (!data) return null;
        return {
          "@context": "https://schema.org",
          "@type": "Course",
          "name": data.title,
          "description": data.description,
          "provider": {
            "@type": "Organization",
            "name": data.institution || "BlissLearn",
            "sameAs": data.link
          },
          "courseMode": data.mode || "online",
          "educationalLevel": data.level_normalized || "beginner",
          "timeRequired": data.duration_hours ? `PT${data.duration_hours}H` : undefined,
          "url": data.link,
          "inLanguage": data.language || "fr",
          "teaches": data.skills ? data.skills.split(',').map((skill: string) => skill.trim()) : undefined
        };

      default:
        return null;
    }
  };

  const structuredData = getStructuredData();
  if (!structuredData) return null;

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(structuredData),
      }}
    />
  );
} 