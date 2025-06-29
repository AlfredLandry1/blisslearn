"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Users, BookOpen, Star, Globe } from "lucide-react";

const stats = [
  {
    number: "10K+",
    label: "Apprenants actifs",
    icon: Users,
    gradient: "from-blue-500 to-blue-600",
    bgGradient: "from-blue-500/10 to-blue-600/10",
    borderColor: "border-blue-500/20",
  },
  {
    number: "500+",
    label: "Cours disponibles",
    icon: BookOpen,
    gradient: "from-purple-500 to-purple-600",
    bgGradient: "from-purple-500/10 to-purple-600/10",
    borderColor: "border-purple-500/20",
  },
  {
    number: "95%",
    label: "Taux de satisfaction",
    icon: Star,
    gradient: "from-yellow-500 to-orange-500",
    bgGradient: "from-yellow-500/10 to-orange-500/10",
    borderColor: "border-yellow-500/20",
  },
  {
    number: "24/7",
    label: "Support disponible",
    icon: Globe,
    gradient: "from-green-500 to-green-600",
    bgGradient: "from-green-500/10 to-green-600/10",
    borderColor: "border-green-500/20",
  },
];

const additionalStats = [
  {
    number: "2.5x",
    label: "Plus rapide d'apprentissage",
    description: "Comparé aux méthodes traditionnelles",
  },
  {
    number: "150+",
    label: "Pays représentés",
    description: "Communauté mondiale",
  },
  {
    number: "99.9%",
    label: "Temps de disponibilité",
    description: "Infrastructure robuste",
  },
];

export const StatsSection = React.memo(function StatsSection() {
  return (
    <section
      className="relative z-10 py-20 px-4 sm:px-6 lg:px-8 bg-gray-900/20 backdrop-blur-sm"
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
            Des chiffres qui parlent d'eux-mêmes
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Notre plateforme transforme l'apprentissage depuis sa création
          </p>
        </motion.div>

        {/* Grille de statistiques responsive */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30, scale: 0.9 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              transition={{
                duration: 0.6,
                delay: index * 0.1,
                ease: "easeOut",
              }}
              viewport={{ once: true, margin: "-50px" }}
              whileHover={{
                y: -8,
                scale: 1.05,
                transition: { duration: 0.3, ease: "easeOut" },
              }}
              className="relative group"
            >
              <Card
                className={`bg-gradient-to-br ${stat.bgGradient} border ${stat.borderColor} hover:border-opacity-40 transition-all duration-300 backdrop-blur-sm overflow-hidden hover:shadow-2xl`}
              >
                <CardContent className="p-4 sm:p-6 lg:p-8 text-center">
                  <div className={`w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 mx-auto mb-3 sm:mb-4 lg:mb-6 bg-white/10 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                    <stat.icon className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 text-white" />
                  </div>
                  <h3 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-white mb-1 sm:mb-2 lg:mb-3">
                    {stat.number}
                  </h3>
                  <p className="text-sm sm:text-base lg:text-lg text-gray-200 font-medium">
                    {stat.label}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Additional stats row */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5, ease: "easeOut" }}
          viewport={{ once: true, margin: "-100px" }}
          className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          {additionalStats.map((stat, index) => (
            <div
              key={index}
              className="bg-gradient-to-r from-gray-800/50 to-gray-900/50 rounded-2xl p-8 border border-gray-700/50 text-center backdrop-blur-sm hover:shadow-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900"
            >
              <div className="text-2xl font-bold text-white mb-2">
                {stat.number}
              </div>
              <div className="text-gray-400">{stat.label}</div>
              <div className="text-blue-400 text-sm mt-2">
                {stat.description}
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
});
