"use client";

import { Particles } from "@/components/ui/particles";
import { Testimonials } from "@/components/ui/testimonials";
import { Navigation, Footer } from "@/components/layout";
import { ScrollToTop } from "@/components/ui/ScrollToTop";
import {
  HeroSection,
  FeaturesSection,
  StatsSection,
  CTASection,
  PricingSection,
  AboutSection,
} from "@/components/sections";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-950 text-white overflow-hidden scroll-smooth">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-20" />
        <Particles />
      </div>

      {/* Navigation */}
      <Navigation />

      {/* Hero Section */}
      <HeroSection />

      {/* Features Section */}
      <FeaturesSection />

      {/* Testimonials Section */}
      <div className="relative z-10">
        <Testimonials />
      </div>

      {/* Stats Section */}
      <StatsSection />

      {/* CTA Section */}
      <CTASection />

      {/* Pricing Section */}
      <PricingSection />

      {/* About Section */}
      <AboutSection />

      {/* Footer */}
      <Footer />

      {/* Scroll to Top Button */}
      <ScrollToTop />
    </div>
  );
}
