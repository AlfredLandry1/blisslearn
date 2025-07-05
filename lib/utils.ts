import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Parse JSON de manière sécurisée en gérant les valeurs invalides
 * @param jsonString - La chaîne JSON à parser
 * @param defaultValue - Valeur par défaut si le parsing échoue
 * @returns Le résultat parsé ou la valeur par défaut
 */
export function safeJsonParse<T>(jsonString: string | null | undefined, defaultValue: T): T {
  if (!jsonString || jsonString === 'null' || jsonString === 'undefined' || jsonString === 'NaN') {
    return defaultValue;
  }
  
  try {
    const parsed = JSON.parse(jsonString);
    return parsed;
  } catch (error) {
    console.warn('Erreur lors du parsing JSON:', error, 'Valeur:', jsonString);
    return defaultValue;
  }
}

/**
 * Parse un tableau JSON de manière sécurisée
 * @param jsonString - La chaîne JSON à parser
 * @returns Un tableau ou un tableau vide si le parsing échoue
 */
export function safeJsonParseArray(jsonString: string | null | undefined): any[] {
  return safeJsonParse(jsonString, []);
}

/**
 * Parse un objet JSON de manière sécurisée
 * @param jsonString - La chaîne JSON à parser
 * @returns Un objet ou un objet vide si le parsing échoue
 */
export function safeJsonParseObject(jsonString: string | null | undefined): Record<string, any> {
  return safeJsonParse(jsonString, {});
}

/**
 * Extrait les informations du champ extra d'un cours
 * @param extraString - La chaîne JSON du champ extra
 * @returns Un objet avec les informations extraites
 */
export function extractCourseExtraInfo(extraString: string | null | undefined) {
  const extra = safeJsonParseObject(extraString);
  
  return {
    instructor: extra.instructor || null,
    category: extra.category || null,
    reviewsCount: extra.reviews_count_numeric || null,
    enrolledStudents: extra.enrolled_students || null,
    availability: extra.availability || null,
    sourceFile: extra.source_file || null,
    // Ajouter d'autres champs selon vos besoins
  };
}

/**
 * Formate une durée en heures vers un format lisible
 * @param hours - Durée en heures (string ou number)
 * @returns Durée formatée (ex: "2h 30min", "1h")
 */
export function formatDuration(hours: number | string | null | undefined): string {
  if (!hours) return "Durée non spécifiée";
  
  const hrs = typeof hours === 'string' ? parseFloat(hours) : hours;
  if (isNaN(hrs) || hrs <= 0) return "Durée non spécifiée";
  
  // Arrondir à 1 heure si la durée est inférieure à 1 heure
  const roundedHours = hrs < 1 ? 1 : hrs;
  
  // Si c'est un nombre entier d'heures
  if (roundedHours === Math.floor(roundedHours)) {
    return `${Math.floor(roundedHours)}h`;
  }
  
  // Si c'est un nombre décimal d'heures
  const wholeHours = Math.floor(roundedHours);
  const minutes = Math.round((roundedHours - wholeHours) * 60);
  
  if (wholeHours > 0) {
    return `${wholeHours}h${minutes > 0 ? ` ${minutes}min` : ""}`;
  }
  return `${minutes}min`;
}

/**
 * Formate un prix en FCFA vers un format lisible
 * @param price - Prix en FCFA (string ou number)
 * @returns Prix formaté (ex: "32 798 FCFA", "Gratuit")
 */
export function formatPrice(price: number | string | null | undefined): string {
  if (!price || price === '0' || price === 0) return "Gratuit";
  
  const priceNum = typeof price === 'string' ? parseInt(price) : price;
  if (isNaN(priceNum) || priceNum <= 0) return "Gratuit";
  
  // Formater en FCFA avec séparateurs de milliers
  return `${priceNum.toLocaleString('fr-FR')} FCFA`;
}

/**
 * Formate un nombre avec séparateurs de milliers
 * @param num - Nombre à formater
 * @returns Nombre formaté
 */
export function formatNumber(num: number | string | null | undefined): string {
  if (!num) return "0";
  
  const numValue = typeof num === 'string' ? parseInt(num) : num;
  if (isNaN(numValue)) return "0";
  
  return numValue.toLocaleString('fr-FR');
}

// Fonction pour générer un numéro de certification unique
export function generateCertificateNumber(): string {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 8);
  const year = new Date().getFullYear();
  return `BL-${year}-${timestamp}-${random}`.toUpperCase();
}

// Fonction pour formater le temps passé en format lisible
export function formatTimeSpent(minutes: number): string {
  if (minutes < 60) {
    return `${minutes} minutes`;
  }
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  if (remainingMinutes === 0) {
    return `${hours}h`;
  }
  return `${hours}h ${remainingMinutes}min`;
}

// ✅ NOUVEAU : Fonction utilitaire pour les requêtes fetch avec gestion d'erreurs robuste
export async function fetchWithTimeout(
  url: string, 
  options: RequestInit = {}, 
  timeoutMs: number = 10000
): Promise<Response> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
  
  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);
    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    
    // Gestion spécifique des erreurs d'annulation
    if (error instanceof Error && error.name === 'AbortError') {
      console.log(`⚠️ Requête annulée: ${url}`);
      throw new Error('Requête annulée (timeout ou navigation)');
    }
    
    // Relancer les autres erreurs
    throw error;
  }
}

// ✅ NOUVEAU : Fonction pour nettoyer les timeouts
export function clearTimeoutSafely(timeoutId: NodeJS.Timeout | null): void {
  if (timeoutId) {
    clearTimeout(timeoutId);
  }
}
