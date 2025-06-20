"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Play, Zap, Users, Star } from "lucide-react";
import { motion } from "framer-motion";
import { HeroIllustration } from "@/components/ui/hero-illustration";
import { SpaceBackground } from "@/components/ui/SpaceBackground";
import Link from "next/link";

export const HeroSection = React.memo(function HeroSection() {
  return (
    <section
      className="relative z-10 py-16 sm:py-20 lg:py-32 px-4 sm:px-6 lg:px-8 overflow-hidden"
      id="hero"
      aria-labelledby="section-title"
    >
      {/* Space Background */}
      <SpaceBackground />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-20 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center lg:text-left order-2 lg:order-1"
          >
            <Badge className="mb-4 sm:mb-6 bg-blue-500/10 text-blue-400 border-blue-500/20 text-sm sm:text-base">
              <Zap className="w-3 h-3 sm:w-4 sm:h-4 mr-2" aria-hidden="true" />
              Nouvelle génération d'apprentissage
            </Badge>

            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 leading-tight">
              L'avenir de l'
              <span className="bg-gradient-to-r from-blue-400 to-blue-300 bg-clip-text text-transparent">
                apprentissage
              </span>
              <br />
              est maintenant
            </h1>

            <p className="text-lg sm:text-xl text-gray-300 mb-6 sm:mb-8 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
              BlissLearn révolutionne l'éducation avec l'IA, des parcours
              personnalisés et une communauté mondiale d'apprenants passionnés.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center lg:justify-start">
              <Link href="/dashboard">
                <Button
                  size="lg"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900"
                  aria-label="Action"
                >
                  Commencer gratuitement
                  <ArrowRight
                    className="ml-2 w-4 h-4 sm:w-5 sm:h-5"
                    aria-hidden="true"
                  />
                </Button>
              </Link>
              <Button
                size="lg"
                variant="outline"
                className="border-gray-600 text-gray-300 hover:bg-gray-800/50 px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900"
                aria-label="Action"
              >
                <Play
                  className="mr-2 w-4 h-4 sm:w-5 sm:h-5"
                  aria-hidden="true"
                />
                Voir la démo
              </Button>
            </div>

            {/* Social proof */}
            <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row items-center justify-center lg:justify-start space-y-2 sm:space-y-0 sm:space-x-6 text-xs sm:text-sm text-gray-400">
              <div className="flex items-center space-x-2">
                <Star
                  className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-400 fill-current"
                  aria-hidden="true"
                />
                <span>4.9/5 étoiles</span>
              </div>
              <div className="flex items-center space-x-2">
                <Users
                  className="w-3 h-3 sm:w-4 sm:h-4 text-blue-400"
                  aria-hidden="true"
                />
                <span>10K+ apprenants</span>
              </div>
            </div>
          </motion.div>

          {/* Right Content - Hero Illustration */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative order-1 lg:order-2"
          >
            <HeroIllustration />
          </motion.div>
        </div>
      </div>
    </section>
  );
});
