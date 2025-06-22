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
