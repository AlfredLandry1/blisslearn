import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
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