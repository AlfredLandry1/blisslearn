"use client";

import { Button } from "@/components/ui/button";
import { Sparkles, Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import Link from "next/link";
import { useUserStore } from "@/stores/userStore";
import React from "react";

export const Navigation = React.memo(function Navigation() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { isAuthenticated, user } = useUserStore();

  return (
    <>
      <nav className="relative z-20 flex items-center justify-between p-4 sm:p-6 lg:p-8 border-b border-gray-800/50 backdrop-blur-sm bg-gray-950/50" role="navigation" aria-label="Navigation principale">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="flex items-center space-x-3"
        >
          <Link href="/" className="flex items-center space-x-3 hover:opacity-80 transition-opacity focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-blue-400 rounded-lg flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" aria-hidden="true" />
            </div>
            <span className="text-xl font-bold text-white">BlissLearn</span>
          </Link>
        </motion.div>

        {/* Desktop Navigation */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="hidden md:flex items-center space-x-6"
        >
          <a
            href="#hero"
            className="text-gray-300 hover:text-white transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900"
            aria-label="Lien de navigation"
          >
            Accueil
          </a>
          <a
            href="#features"
            className="text-gray-300 hover:text-white transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900"
            aria-label="Lien de navigation"
          >
            Fonctionnalités
          </a>
          <a
            href="#pricing"
            className="text-gray-300 hover:text-white transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900"
            aria-label="Lien de navigation"
          >
            Tarifs
          </a>
          <a
            href="#about"
            className="text-gray-300 hover:text-white transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900"
            aria-label="Lien de navigation"
          >
            À propos
          </a>
          <Link href="/dashboard/my-courses" className="flex items-center gap-2 text-gray-300 hover:text-blue-400 transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900 group">
            Cours
          </Link>
          {isAuthenticated ? (
            <Link href="/dashboard">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900" aria-label="Action">
                Continuer vers mon espace
              </Button>
            </Link>
          ) : (
            <>
              <Link href="/auth/login">
                <Button
                  variant="ghost"
                  className="text-gray-300 hover:text-white hover:bg-gray-800/50 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900"
                  aria-label="Action"
                >
                  Se connecter
                </Button>
              </Link>
              <Link href="/auth/register">
                <Button className="bg-blue-600 hover:bg-blue-700 text-white transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900" aria-label="Action">
                  Commencer
                </Button>
              </Link>
            </>
          )}
        </motion.div>

        {/* Mobile menu button */}
        <div className="md:hidden">
          <Button 
            variant="ghost" 
            size="sm" 
            className="hover:bg-gray-800/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Action"
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6" aria-hidden="true" />
            ) : (
              <Menu className="w-6 h-6" aria-hidden="true" />
            )}
          </Button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="md:hidden relative z-20 bg-gray-900/95 backdrop-blur-sm border-b border-gray-800/50"
          >
            <div className="px-4 py-6 space-y-4">
              <a
                href="#features"
                className="block text-gray-300 hover:text-white transition-colors py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900"
                onClick={() => setIsMobileMenuOpen(false)}
                aria-label="Lien de navigation"
              >
                Fonctionnalités
              </a>
              <a
                href="#pricing"
                className="block text-gray-300 hover:text-white transition-colors py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900"
                onClick={() => setIsMobileMenuOpen(false)}
                aria-label="Lien de navigation"
              >
                Tarifs
              </a>
              <a
                href="#about"
                className="block text-gray-300 hover:text-white transition-colors py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900"
                onClick={() => setIsMobileMenuOpen(false)}
                aria-label="Lien de navigation"
              >
                À propos
              </a>
              <Link href="/dashboard/my-courses" className="flex items-center gap-2 text-gray-300 hover:text-blue-400 transition-colors py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900 group" onClick={() => setIsMobileMenuOpen(false)}>
                Cours
              </Link>
              <div className="pt-4 space-y-3">
                {isAuthenticated ? (
                  <Link href="/dashboard">
                    <Button 
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900"
                      onClick={() => setIsMobileMenuOpen(false)}
                      aria-label="Action"
                    >
                      Continuer vers mon espace
                    </Button>
                  </Link>
                ) : (
                  <>
                    <Link href="/auth/login">
                      <Button
                        variant="ghost"
                        className="w-full text-gray-300 hover:text-white hover:bg-gray-800/50 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900"
                        onClick={() => setIsMobileMenuOpen(false)}
                        aria-label="Action"
                      >
                        Se connecter
                      </Button>
                    </Link>
                    <Link href="/auth/register">
                      <Button 
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900"
                        onClick={() => setIsMobileMenuOpen(false)}
                        aria-label="Action"
                      >
                        Commencer
                      </Button>
                    </Link>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}); 