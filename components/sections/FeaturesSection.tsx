"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import {
  Brain,
  Users,
  Target,
  BookOpen,
  TrendingUp,
  Shield,
} from "lucide-react";

const features = [
  {
    icon: Brain,
    title: "IA Adaptative",
    description:
      "Notre IA analyse votre progression et adapte le contenu à votre rythme d'apprentissage.",
    color: "from-purple-500 to-purple-600",
  },
  {
    icon: Users,
    title: "Communauté Active",
    description:
      "Rejoignez des milliers d'apprenants, partagez vos projets et collaborez ensemble.",
    color: "from-blue-500 to-blue-600",
  },
  {
    icon: Target,
    title: "Objectifs Personnalisés",
    description:
      "Définissez vos propres objectifs et suivez vos progrès avec des métriques détaillées.",
    color: "from-green-500 to-green-600",
  },
  {
    icon: BookOpen,
    title: "Contenu Premium",
    description: "Accédez à des cours créés par des experts du monde entier.",
    color: "from-orange-500 to-orange-600",
  },
  {
    icon: TrendingUp,
    title: "Analytics Avancés",
    description:
      "Visualisez vos progrès avec des graphiques et analyses détaillés.",
    color: "from-red-500 to-red-600",
  },
  {
    icon: Shield,
    title: "Sécurité Garantie",
    description:
      "Vos données sont protégées avec les meilleures pratiques de sécurité.",
    color: "from-indigo-500 to-indigo-600",
  },
];

export const FeaturesSection = React.memo(function FeaturesSection() {
  return (
    <section
      id="features"
      className="relative z-10 py-20 px-4 sm:px-6 lg:px-8 bg-gray-900/30 backdrop-blur-sm"
      aria-labelledby="section-title"
    >
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          viewport={{ once: true, margin: "-100px" }}
          className="text-center mb-16"
        >
          <h2
            className="text-3xl sm:text-4xl font-bold mb-6"
            id="section-title"
          >
            Tout ce dont vous avez besoin pour apprendre
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Des outils puissants et une communauté active pour transformer votre
            apprentissage
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.6,
                delay: index * 0.1,
                ease: "easeOut",
              }}
              viewport={{ once: true, margin: "-50px" }}
              whileHover={{ y: -5, transition: { duration: 0.3 } }}
            >
              <Card className="bg-gray-800/50 border-gray-700 hover:border-gray-600 transition-all duration-300 h-full backdrop-blur-sm hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900">
                <CardContent className="p-6">
                  <div
                    className={`w-12 h-12 bg-gradient-to-r ${feature.color} rounded-lg flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-110`}
                  >
                    <feature.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-gray-400 leading-relaxed">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
});
