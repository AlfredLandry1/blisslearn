"use client";

import { motion } from "framer-motion";
import { Particles } from "@/components/ui/particles";
import { SpaceBackground } from "@/components/ui/SpaceBackground";
import { Sparkles, ArrowLeft } from "lucide-react";
import Link from "next/link";

interface AuthLayoutProps {
  children: React.ReactNode;
}

export function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="bg-gray-950 text-white overflow-x-hidden">
      {/* Animated Background - Fixed to cover entire page */}
      <div className="fixed inset-0">
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-20" />
        <Particles />
      </div>

      {/* Space Background - Fixed to cover entire page */}
      <div className="fixed inset-0">
        <SpaceBackground />
      </div>

      {/* Navigation */}
      <nav className="relative z-20 flex items-center justify-between p-4 sm:p-6 lg:p-8">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="flex items-center space-x-3"
        >
          <Link href="/" className="flex items-center space-x-3 hover:opacity-80 transition-opacity">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-blue-400 rounded-lg flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-white">BlissLearn</span>
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <Link
            href="/"
            className="flex items-center space-x-2 text-gray-300 hover:text-white transition-all duration-300 hover:scale-105"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Retour à l'accueil</span>
          </Link>
        </motion.div>
      </nav>

      {/* Main Content */}
      <div className="relative z-10 flex items-center justify-center min-h-[calc(100vh-120px)] px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="w-full max-w-md"
        >
          {children}
        </motion.div>
      </div>

      {/* Floating Elements - Fixed to viewport */}
      <div className="fixed top-1/4 left-1/4 w-32 h-32 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-full blur-3xl animate-pulse pointer-events-none" />
      <div className="fixed bottom-1/4 right-1/4 w-40 h-40 bg-gradient-to-r from-purple-500/10 to-blue-500/10 rounded-full blur-3xl animate-pulse pointer-events-none" style={{ animationDelay: '2s' }} />
    </div>
  );
} 