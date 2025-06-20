"use client";

import { ChevronUp } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";

export function ScrollToTop() {
  const [showScrollToTop, setShowScrollToTop] = useState(false);

  // Fonction pour gérer le scroll et afficher/masquer le bouton
  const handleScroll = () => {
    const scrollTop = window.scrollY;
    setShowScrollToTop(scrollTop > 300);
  };

  // Fonction pour remonter en haut
  const scrollToTop = () => {
    const heroSection = document.getElementById('hero');
    if (heroSection) {
      heroSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Ajouter l'écouteur de scroll avec useEffect
  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    
    // Cleanup function
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <AnimatePresence>
      {showScrollToTop && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 20 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 z-50 w-12 h-12 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 backdrop-blur-sm border border-blue-500/20 hover:scale-110 group"
          aria-label="Retour en haut"
        >
          <ChevronUp className="w-6 h-6 text-white mx-auto group-hover:-translate-y-0.5 transition-transform duration-300" />
          
          {/* Tooltip */}
          <div className="absolute bottom-full right-0 mb-2 px-3 py-1 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
            Retour en haut
            <div className="absolute top-full right-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
          </div>
        </motion.button>
      )}
    </AnimatePresence>
  );
} 