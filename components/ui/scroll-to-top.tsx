"use client";

import React, { useState, useEffect } from "react";
import { Button } from "./button";
import { ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";

interface ScrollToTopProps {
  className?: string;
  threshold?: number;
}

export function ScrollToTop({ className, threshold = 400 }: ScrollToTopProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > threshold) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, [threshold]);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <>
      {isVisible && (
        <Button
          onClick={scrollToTop}
          size="icon"
          className={cn(
            "fixed bottom-6 right-6 z-50 rounded-full shadow-lg hover:shadow-xl transition-all duration-200",
            "bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700",
            "text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-gray-600",
            className
          )}
          aria-label="Retour en haut de page"
        >
          <ChevronUp className="w-5 h-5" aria-hidden="true" />
        </Button>
      )}
    </>
  );
}