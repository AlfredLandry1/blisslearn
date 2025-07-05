"use client";

import { useEffect, useState } from "react";

interface FontLoaderProps {
  children: React.ReactNode;
}

export function FontLoader({ children }: FontLoaderProps) {
  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    // Vérifier si les polices sont déjà chargées
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(() => {
        setFontsLoaded(true);
      });
    } else {
      // Fallback pour les navigateurs qui ne supportent pas document.fonts
      setFontsLoaded(true);
    }
  }, []);

  return (
    <div className={fontsLoaded ? "fonts-loaded" : "fonts-loading"}>
      {children}
    </div>
  );
} 