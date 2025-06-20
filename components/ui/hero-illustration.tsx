"use client";

import React from "react";
import { motion } from "framer-motion";
import { Brain, Users, Star } from "lucide-react";

export const HeroIllustration = React.memo(function HeroIllustration() {
  return (
    <div className="relative">
      {/* Main container */}
      <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-8 border border-gray-700 shadow-2xl">
        {/* Terminal header */}
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-3 h-3 bg-red-500 rounded-full"></div>
          <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
          <div className="ml-4 text-sm text-gray-400">blisslearn.dev</div>
        </div>

        {/* Content area */}
        <div className="space-y-6">
          {/* Command line */}
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <span className="text-green-400">$</span>
              <span className="text-blue-400">Start</span>
              <span className="text-white">using blisslearn</span>
            </div>
            <div className="text-gray-300 text-sm">
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                </div>
                <span>Installing AI-powered learning platform...</span>
              </div>
            </div>
          </div>

          {/* Progress bars */}
          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-300">IA Engine</span>
              <span className="text-green-400">✓</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2">
              <motion.div
                className="bg-green-500 h-2 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: "100%" }}
                transition={{ duration: 2, delay: 0.5 }}
              />
            </div>

            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-300">Community</span>
              <span className="text-green-400">✓</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2">
              <motion.div
                className="bg-blue-500 h-2 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: "100%" }}
                transition={{ duration: 2, delay: 1 }}
              />
            </div>

            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-300">Analytics</span>
              <span className="text-green-400">✓</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2">
              <motion.div
                className="bg-purple-500 h-2 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: "100%" }}
                transition={{ duration: 2, delay: 1.5 }}
              />
            </div>
          </div>

          {/* Success message */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 2.5 }}
            className="bg-green-500/10 border border-green-500/20 rounded-lg p-4"
          >
            <div className="flex items-center space-x-2">
              <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                <div className="w-2 h-2 bg-white rounded-full"></div>
              </div>
              <span className="text-green-400 font-medium">
                Installation réussie !
              </span>
            </div>
            <p className="text-gray-300 text-sm mt-1">
              BlissLearn est maintenant prêt à transformer votre apprentissage.
            </p>
          </motion.div>

          {/* Floating elements */}
          <motion.div
            className="absolute -top-4 -right-4 w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center"
            animate={{
              y: [0, -10, 0],
              rotate: [0, 5, 0],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <Brain className="w-8 h-8 text-blue-400" aria-hidden="true" />
          </motion.div>

          <motion.div
            className="absolute -bottom-4 -left-4 w-12 h-12 bg-purple-500/20 rounded-full flex items-center justify-center"
            animate={{
              y: [0, 10, 0],
              rotate: [0, -5, 0],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1,
            }}
          >
            <Users className="w-6 h-6 text-purple-400" aria-hidden="true" />
          </motion.div>

          <motion.div
            className="absolute top-1/2 -right-8 w-10 h-10 bg-green-500/20 rounded-full flex items-center justify-center"
            animate={{
              scale: [1, 1.1, 1],
              opacity: [0.7, 1, 0.7],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 0.5,
            }}
          >
            <Star className="w-5 h-5 text-green-400" aria-hidden="true" />
          </motion.div>
        </div>
      </div>
    </div>
  );
});
