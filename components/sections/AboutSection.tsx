"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Sparkles, Target, Users, Globe } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import React from "react";

const aboutItems = [
  {
    icon: Target,
    title: "Notre Vision",
    description:
      "Créer un écosystème d'apprentissage où chaque individu peut développer son plein potentiel grâce à la technologie et à l'intelligence artificielle.",
    gradient: "from-blue-500 to-blue-600",
  },
  {
    icon: Users,
    title: "Notre Équipe",
    description:
      "Des experts en éducation, en technologie et en IA travaillent ensemble pour créer la meilleure expérience d'apprentissage possible.",
    gradient: "from-purple-500 to-purple-600",
  },
  {
    icon: Globe,
    title: "Impact Mondial",
    description:
      "Plus de 10 000 apprenants dans 150+ pays utilisent déjà BlissLearn pour transformer leur parcours éducatif.",
    gradient: "from-green-500 to-green-600",
  },
];

const timeline = [
  { year: "2022", event: "Création de BlissLearn" },
  { year: "2023", event: "Lancement de l'IA adaptative" },
  { year: "2025", event: "Expansion mondiale" },
];

const values = [
  {
    name: "Innovation",
    description: "Technologie de pointe",
    color: "text-blue-400",
  },
  {
    name: "Qualité",
    description: "Excellence académique",
    color: "text-green-400",
  },
  { name: "Accessibilité", description: "Pour tous", color: "text-purple-400" },
  {
    name: "Communauté",
    description: "Apprentissage collaboratif",
    color: "text-orange-400",
  },
];

export const AboutSection = React.memo(function AboutSection() {
  return (
    <section
      id="about"
      className="relative z-10 py-16 sm:py-20 px-4 sm:px-6 lg:px-8 bg-gray-900/20 backdrop-blur-sm"
     aria-labelledby="section-title">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 sm:gap-16 lg:gap-24 items-center">
          {/* Left Content - Text */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            viewport={{ once: true, margin: "-100px" }}
            className="space-y-6 sm:space-y-8 order-2 lg:order-1"
          >
            <div>
              <Badge className="mb-4 sm:mb-6 bg-blue-500/10 text-blue-400 border-blue-500/20 text-sm sm:text-base">
                <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 mr-2" aria-hidden="true" />
                Notre mission
              </Badge>
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6 leading-tight" id="section-title">
                Révolutionner l'
                <span className="bg-gradient-to-r from-blue-400 to-blue-300 bg-clip-text text-transparent">
                  apprentissage
                </span>
                <br />
                pour tous
              </h2>
              <p className="text-lg sm:text-xl text-gray-300 leading-relaxed">
                BlissLearn est né d'une vision simple : rendre l'éducation
                accessible, personnalisée et efficace pour chaque apprenant,
                partout dans le monde.
              </p>
            </div>

            <div className="space-y-4 sm:space-y-6">
              {aboutItems.map((item, index) => (
                <motion.div
                  key={index}
                  className="flex items-start space-x-3 sm:space-x-4"
                  whileHover={{ x: 5, transition: { duration: 0.3 } }}
                >
                  <div
                    className={`w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r ${item.gradient} rounded-xl flex items-center justify-center flex-shrink-0`}
                  >
                    <item.icon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg sm:text-xl font-semibold text-white mb-1 sm:mb-2">
                      {item.title}
                    </h3>
                    <p className="text-gray-400 leading-relaxed text-sm sm:text-base">
                      {item.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="pt-4 sm:pt-6">
              <Link href="/dashboard">
                <Button
                  size="lg"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900"
                 aria-label="Action">
                  Commencer dès maintenant !
                  <ArrowRight className="ml-2 w-4 h-4 sm:w-5 sm:h-5" aria-hidden="true" />
                </Button>
              </Link>
            </div>
          </motion.div>

          {/* Right Content - Visual Elements */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            viewport={{ once: true, margin: "-100px" }}
            className="relative order-1 lg:order-2"
          >
            {/* Main Card */}
            <Card className="bg-gradient-to-br from-gray-800/60 to-gray-900/60 border-gray-700 backdrop-blur-sm overflow-hidden hover:shadow-2xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900">
              <CardContent className="p-6 sm:p-8">
                <div className="space-y-6 sm:space-y-8">
                  {/* Stats Row */}
                  <div className="grid grid-cols-3 gap-4 sm:gap-6">
                    <div className="text-center">
                      <div className="text-2xl sm:text-3xl font-bold text-white mb-1 sm:mb-2">
                        10K+
                      </div>
                      <div className="text-xs sm:text-sm text-gray-400">
                        Apprenants
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl sm:text-3xl font-bold text-white mb-1 sm:mb-2">
                        500+
                      </div>
                      <div className="text-xs sm:text-sm text-gray-400">
                        Cours
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl sm:text-3xl font-bold text-white mb-1 sm:mb-2">
                        95%
                      </div>
                      <div className="text-xs sm:text-sm text-gray-400">
                        Satisfaction
                      </div>
                    </div>
                  </div>

                  {/* Timeline */}
                  <div className="space-y-4 sm:space-y-6">
                    <h3 className="text-lg sm:text-xl font-semibold text-white mb-3 sm:mb-4">
                      Notre Parcours
                    </h3>
                    <div className="space-y-3 sm:space-y-4">
                      {timeline.map((item, index) => (
                        <div
                          key={index}
                          className="flex items-center space-x-3 sm:space-x-4"
                        >
                          <div className="w-2 h-2 sm:w-3 sm:h-3 bg-blue-500 rounded-full"></div>
                          <div>
                            <div className="text-white font-medium text-sm sm:text-base">
                              {item.year}
                            </div>
                            <div className="text-gray-400 text-xs sm:text-sm">
                              {item.event}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Values */}
                  <div>
                    <h3 className="text-lg sm:text-xl font-semibold text-white mb-3 sm:mb-4">
                      Nos Valeurs
                    </h3>
                    <div className="grid grid-cols-2 gap-3 sm:gap-4">
                      {values.map((value, index) => (
                        <div
                          key={index}
                          className="bg-gray-800/50 rounded-lg p-3 sm:p-4 hover:bg-gray-800/70 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900"
                        >
                          <div
                            className={`font-medium mb-1 text-sm sm:text-base ${value.color}`}
                          >
                            {value.name}
                          </div>
                          <div className="text-gray-400 text-xs sm:text-sm">
                            {value.description}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Floating Elements */}
            <div className="absolute -top-4 -right-4 w-16 h-16 sm:w-24 sm:h-24 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full blur-xl"></div>
            <div className="absolute -bottom-4 -left-4 w-20 h-20 sm:w-32 sm:h-32 bg-gradient-to-r from-green-500/20 to-blue-500/20 rounded-full blur-xl"></div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}); 