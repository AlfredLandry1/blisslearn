"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle } from "lucide-react";
import { motion } from "framer-motion";
import { SpaceBackground } from "@/components/ui/SpaceBackground";
import Link from "next/link";

const pricingPlans = [
  {
    name: "Starter",
    price: "0 XFA",
    period: "Pour toujours",
    badge: "Gratuit",
    badgeColor: "bg-gray-600 text-gray-200 border-gray-500",
    features: [
      "5 cours gratuits",
      "Accès à la communauté",
      "Support de base",
      "Certificats de base",
    ],
    buttonText: "Commencer gratuitement",
    buttonVariant: "outline" as const,
    popular: false,
    gradient: "from-gray-800/50 to-gray-900/50",
    borderColor: "border-gray-700",
    hoverBorderColor: "hover:border-gray-600",
  },
  {
    name: "Pro",
    price: "12.000 XFA",
    period: "par mois",
    badge: "Standard",
    badgeColor: "bg-blue-600 text-white border-blue-500",
    features: [
      "Tous les cours",
      "IA adaptative avancée",
      "Support prioritaire",
      "Certificats premium",
      "Analytics détaillés",
      "Téléchargements",
    ],
    buttonText: "Commencer l'essai gratuit",
    buttonVariant: "default" as const,
    popular: true,
    gradient: "from-blue-500/10 to-blue-600/10",
    borderColor: "border-blue-500/30",
    hoverBorderColor: "hover:border-blue-400/50",
  },
  {
    name: "Enterprise",
    price: "25.000 XFA",
    period: "par mois",
    badge: "Premium",
    badgeColor: "bg-purple-600 text-white border-purple-500",
    features: [
      "Tout du plan Pro",
      "Cours personnalisés",
      "Mentorat 1-on-1",
      "Support 24/7",
      "API d'intégration",
      "Gestion d'équipe",
    ],
    buttonText: "Contacter les ventes",
    buttonVariant: "outline" as const,
    popular: false,
    gradient: "from-purple-500/10 to-purple-600/10",
    borderColor: "border-purple-500/30",
    hoverBorderColor: "hover:border-purple-400/50",
  },
];

export const PricingSection = React.memo(function PricingSection() {
  return (
    <section
      id="pricing"
      className="relative z-10 py-20 px-4 sm:px-6 lg:px-8 overflow-hidden"
      aria-labelledby="section-title"
    >
      {/* Space Background */}
      <SpaceBackground />

      <div className="max-w-7xl mx-auto w-full relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          viewport={{ once: true, margin: "-100px" }}
          className="text-center mb-16"
        >
          <h2
            className="text-center text-3xl sm:text-4xl lg:text-5xl font-bold mb-6"
            id="section-title"
          >
            Choisissez votre plan
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Des options flexibles pour tous les types d'apprenants, de
            l'étudiant débutant au professionnel expérimenté
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-12 max-w-6xl mx-auto">
          {pricingPlans.map((plan, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.6,
                delay: index * 0.1,
                ease: "easeOut",
              }}
              viewport={{ once: true, margin: "-50px" }}
              whileHover={{ y: -10, transition: { duration: 0.3 } }}
              className={`relative ${
                plan.name === "Enterprise" ? "md:col-span-2 lg:col-span-1" : ""
              }`}
            >
              {/* Popular Badge */}
              {plan.popular && (
                <div className="absolute -top-3 sm:-top-4 left-1/2 transform -translate-x-1/2 z-10">
                  <Badge className="bg-gradient-to-r from-blue-500 to-blue-600 text-white border-0 px-3 sm:px-4 py-1 sm:py-2 text-xs sm:text-sm">
                    Le plus populaire
                  </Badge>
                </div>
              )}

              <Card
                className={`bg-gradient-to-br ${plan.gradient} ${plan.borderColor} ${plan.hoverBorderColor} transition-all duration-300 backdrop-blur-sm h-full relative overflow-hidden`}
              >
                {plan.popular && (
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900" />
                )}

                <CardContent className="p-6 sm:p-8 text-center relative">
                  {/* Plan Badge */}
                  <div className="mb-4 sm:mb-6">
                    <Badge className={`${plan.badgeColor} text-xs sm:text-sm`}>
                      {plan.badge}
                    </Badge>
                  </div>

                  {/* Plan Name */}
                  <h3 className="text-xl sm:text-2xl font-bold text-white mb-3 sm:mb-4">
                    {plan.name}
                  </h3>

                  {/* Price */}
                  <div className="mb-6 sm:mb-8">
                    <div className="text-3xl sm:text-4xl font-bold text-white mb-1 sm:mb-2">
                      {plan.price}
                    </div>
                    <div className="text-gray-400 text-sm sm:text-base">
                      {plan.period}
                    </div>
                  </div>

                  {/* Features */}
                  <ul className="space-y-3 sm:space-y-4 mb-6 sm:mb-8 text-center md:text-left">
                    {plan.features.map((feature, featureIndex) => (
                      <li
                        key={featureIndex}
                        className="flex items-center space-x-3"
                      >
                        <CheckCircle
                          className="w-4 h-4 sm:w-5 sm:h-5 text-green-400 flex-shrink-0"
                          aria-hidden="true"
                        />
                        <span className="text-gray-300 text-sm sm:text-base">
                          {feature}
                        </span>
                      </li>
                    ))}
                  </ul>

                  {/* CTA Button */}
                  <Link href="/dashboard">
                    <Button
                      variant={plan.buttonVariant}
                      className={`w-full text-sm sm:text-base transition-all duration-300 ${
                        plan.buttonVariant === "default"
                          ? "bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-lg hover:shadow-xl"
                          : plan.name === "Enterprise"
                          ? "border-purple-600 text-purple-300 hover:bg-purple-600 hover:text-white"
                          : "border-gray-600 text-gray-300 hover:bg-gray-700 hover:text-white"
                      }`}
                      aria-label="Action"
                    >
                      {plan.buttonText}
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Additional Info */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5, ease: "easeOut" }}
          viewport={{ once: true, margin: "-100px" }}
          className="text-center mt-12"
        >
          <p className="text-gray-400 text-sm">
            Tous les plans incluent un essai gratuit de 14 jours • Annulation à
            tout moment
          </p>
        </motion.div>
      </div>
    </section>
  );
});
