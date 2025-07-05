import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
    datasources: {
      db: {
        url: process.env.DATABASE_URL,
      },
    },
    // Configuration du pool de connexions
    // Ces paramètres aident à gérer les timeouts et les reconnexions
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

// Test de connexion au démarrage
if (process.env.NODE_ENV === "development") {
  prisma.$connect()
    .then(() => {
      console.log("✅ Connexion à la base de données réussie");
    })
    .catch((error) => {
      console.error("❌ Erreur de connexion à la base de données:", error);
    });
}

// Fonction utilitaire pour gérer les erreurs de connexion
export async function withRetry<T>(
  operation: () => Promise<T>,
  maxRetries: number = 3,
  delay: number = 1000
): Promise<T> {
  let lastError: Error;
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error as Error;
      
      // Si c'est une erreur de connexion, on réessaie
      if (error && typeof error === 'object' && 'code' in error) {
        const prismaError = error as any;
        if (prismaError.code === 'P2024' || prismaError.code === 'P1001') {
          console.warn(`Tentative ${attempt}/${maxRetries} échouée, reconnexion...`);
          
          if (attempt < maxRetries) {
            // Attendre avant de réessayer
            await new Promise(resolve => setTimeout(resolve, delay * attempt));
            
            // Tenter de reconnecter
            try {
              await prisma.$disconnect();
              await prisma.$connect();
            } catch (reconnectError) {
              console.error("Erreur lors de la reconnexion:", reconnectError);
            }
            continue;
          }
        }
      }
      
      // Si ce n'est pas une erreur de connexion ou qu'on a épuisé les tentatives
      throw error;
    }
  }
  
  throw lastError!;
} 