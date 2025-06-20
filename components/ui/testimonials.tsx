"use client";

import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const testimonials = [
  {
    name: "Sarah Chengue",
    role: "Développeuse Full-Stack",
    company: "TechCorp",
    content:
      "BlissLearn a complètement transformé ma façon d'apprendre. L'IA adaptative m'aide à progresser à mon rythme et la communauté est incroyablement supportive.",
    rating: 5,
    avatar: "SC",
  },
  {
    name: "Marcus Rodrigue",
    role: "Étudiant en IA",
    company: "E N P Y",
    content:
      "Les cours sont excellents et l'interface est intuitive. J'ai pu maîtriser des concepts complexes grâce aux explications personnalisées.",
    rating: 5,
    avatar: "MR",
  },
  {
    name: "Emma Thompson",
    role: "Product Manager",
    company: "StartupXYZ",
    content:
      "En tant que manager, j'apprécie les analytics détaillés qui me permettent de suivre les progrès de mon équipe. Un outil indispensable !",
    rating: 5,
    avatar: "ET",
  },
];

export function Testimonials() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-900/30">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-bold mb-6">
            Ce que disent nos apprenants
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Découvrez pourquoi des milliers d'apprenants choisissent BlissLearn
            pour leur développement professionnel
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              viewport={{ once: true }}
              whileHover={{ y: -5 }}
            >
              <Card className="bg-gray-800/50 border-gray-700 hover:border-gray-600 transition-all duration-300 h-full">
                <CardContent className="p-6">
                  {/* Quote icon */}
                  <div className="mb-4">
                    <Quote className="w-8 h-8 text-blue-400 opacity-50" />
                  </div>

                  {/* Rating */}
                  <div className="flex items-center space-x-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star
                        key={i}
                        className="w-4 h-4 text-yellow-400 fill-current"
                      />
                    ))}
                  </div>

                  {/* Content */}
                  <p className="text-gray-300 mb-6 leading-relaxed">
                    "{testimonial.content}"
                  </p>

                  {/* Author */}
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-blue-400 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                      {testimonial.avatar}
                    </div>
                    <div>
                      <div className="text-white font-semibold">
                        {testimonial.name}
                      </div>
                      <div className="text-gray-400 text-sm">
                        {testimonial.role}
                      </div>
                      <div className="text-blue-400 text-sm">
                        {testimonial.company}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Stats row */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          viewport={{ once: true }}
          className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 text-center"
        >
          <div className="p-6 bg-gray-800/30 rounded-lg border border-gray-700">
            <div className="text-3xl font-bold text-white mb-2">98%</div>
            <div className="text-gray-400">Taux de satisfaction</div>
          </div>
          <div className="p-6 bg-gray-800/30 rounded-lg border border-gray-700">
            <div className="text-3xl font-bold text-white mb-2">2.5x</div>
            <div className="text-gray-400">Plus rapide d'apprentissage</div>
          </div>
          <div className="p-6 bg-gray-800/30 rounded-lg border border-gray-700">
            <div className="text-3xl font-bold text-white mb-2">24/7</div>
            <div className="text-gray-400">Support disponible</div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
