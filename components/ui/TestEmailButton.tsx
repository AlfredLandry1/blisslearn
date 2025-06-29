"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Mail, Loader2 } from "lucide-react";
import { toast } from "sonner";

export function TestEmailButton() {
  const [isLoading, setIsLoading] = useState(false);

  const testEmail = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/test-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (response.ok) {
        toast.success('Email de test envoyé avec succès !');
        console.log('✅ Email de test envoyé:', data);
      } else {
        toast.error(`Erreur: ${data.error || 'Erreur inconnue'}`);
        console.error('❌ Erreur email de test:', data);
      }
    } catch (error) {
      toast.error('Erreur réseau lors du test email');
      console.error('❌ Erreur réseau:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      onClick={testEmail}
      disabled={isLoading}
      variant="outline"
      className="border-blue-500 text-blue-400 hover:bg-blue-500/10"
    >
      {isLoading ? (
        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
      ) : (
        <Mail className="w-4 h-4 mr-2" />
      )}
      Tester l'envoi d'email
    </Button>
  );
} 