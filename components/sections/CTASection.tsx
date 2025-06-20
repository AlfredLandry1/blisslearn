"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import { GlobeBackground } from "@/components/ui/GlobeBackground";

export const CTASection = React.memo(function CTASection() {
  return (
    <section className="relative z-10 py-20 px-4 sm:px-6 lg:px-8 bg-gray-900/40 backdrop-blur-sm overflow-hidden" aria-labelledby="section-title">
      {/* Globe en bas */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 z-0 w-[120vw] h-[60vw] min-w-[900px] max-w-none pointer-events-none select-none" style={{minHeight:'400px'}}>
        <GlobeBackground
          pointCount={3000}
          lineCount={700}
          radius={3.5}
          style={{ width: '100%', height: '100%' }}
        />
      </div>
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        viewport={{ once: true, margin: "-100px" }}
        className="max-w-4xl mx-auto text-center relative z-10"
      >
        <Card className="bg-gradient-to-r from-gray-800/80 to-gray-900/80 border-gray-700 backdrop-blur-sm hover:shadow-2xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900">
          <CardContent className="p-12">
            <h2 className="text-3xl sm:text-4xl font-bold mb-6" id="section-title">
              Prêt à transformer votre apprentissage ?
            </h2>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Rejoignez des milliers d'apprenants qui ont déjà révolutionné leur
              façon d'apprendre
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/dashboard">
                <Button
                  size="lg"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 text-lg transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900"
                  aria-label="Action"
                >
                  Commencer maintenant
                  <ArrowRight className="ml-2 w-5 h-5" aria-hidden="true" />
                </Button>
              </Link>
              <a href="#about">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-gray-600 text-gray-300 hover:bg-gray-800/50 px-8 py-4 text-lg transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900"
                  aria-label="Action"
                >
                  En savoir plus
                </Button>
              </a>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </section>
  );
});
