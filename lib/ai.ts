import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export interface AISummaryResponse {
  summary: string;
  keyPoints: string[];
  recommendations?: string;
  insights?: string;
}

export async function generateAISummary(prompt: string): Promise<AISummaryResponse> {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const enhancedPrompt = `
      ${prompt}
      
      IMPORTANT : Réponds UNIQUEMENT au format JSON suivant, sans texte avant ou après :
      {
        "summary": "Résumé détaillé et personnalisé de l'apprentissage, en tenant compte des notes personnelles et du contexte",
        "keyPoints": [
          "Point clé 1 avec lien vers les notes personnelles si pertinent",
          "Point clé 2 avec observation sur le style d'apprentissage",
          "Point clé 3 avec recommandation spécifique"
        ],
        "recommendations": "Recommandations personnalisées basées sur le profil d'apprentissage, le temps passé et les notes personnelles. Inclus des stratégies concrètes pour optimiser l'apprentissage.",
        "insights": "Insights approfondis sur les patterns d'apprentissage, les forces identifiées, et des observations sur la progression. Fais des liens avec les notes personnelles si disponibles."
      }
      
      RÈGLES :
      - Utilise un ton encourageant et personnalisé
      - Fais référence aux notes personnelles quand c'est pertinent
      - Adapte les recommandations au style d'apprentissage apparent
      - Sois spécifique et concret dans les conseils
      - Évite les généralités, personnalise selon le contexte
    `;

    const result = await model.generateContent(enhancedPrompt);
    const response = await result.response;
    const text = response.text();
    
    // Essayer de parser le JSON avec plusieurs méthodes
    try {
      // Méthode 1 : Chercher un objet JSON complet
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        return validateAndCleanResponse(parsed);
      }
      
      // Méthode 2 : Essayer de parser directement
      const parsed = JSON.parse(text);
      return validateAndCleanResponse(parsed);
      
    } catch (parseError) {
      console.error('Erreur parsing JSON:', parseError);
      console.log('Texte reçu:', text);
    }

    // Fallback si le parsing JSON échoue
    return createFallbackResponse(text);

  } catch (error) {
    console.error('Erreur génération IA:', error);
    return createFallbackResponse();
  }
}

function validateAndCleanResponse(parsed: any): AISummaryResponse {
  return {
    summary: parsed.summary || 'Résumé de progression généré automatiquement.',
    keyPoints: Array.isArray(parsed.keyPoints) ? parsed.keyPoints : ['Progression validée'],
    recommendations: parsed.recommendations || 'Continuez votre apprentissage en vous basant sur les concepts acquis.',
    insights: parsed.insights || 'Votre progression montre un engagement positif dans l\'apprentissage.'
  };
}

function createFallbackResponse(text?: string): AISummaryResponse {
  if (text) {
    // Essayer d'extraire des informations utiles du texte
    const lines = text.split('\n').filter(line => line.trim().length > 0);
    const summary = lines[0] || 'Rapport généré automatiquement suite à la validation de votre palier.';
    const keyPoints = lines.slice(1, 4).filter(line => line.length > 10) || ['Progression validée'];
    
    return {
      summary: summary.substring(0, 500),
      keyPoints: keyPoints.map(point => point.substring(0, 200)),
      recommendations: 'Continuez votre apprentissage en vous basant sur les concepts acquis.',
      insights: 'Votre progression montre un engagement positif dans l\'apprentissage.'
    };
  }
  
  return {
    summary: 'Rapport généré automatiquement suite à la validation de votre palier.',
    keyPoints: ['Progression validée', 'Concepts acquis', 'Continuité recommandée'],
    recommendations: 'Continuez votre apprentissage en vous basant sur les concepts acquis.',
    insights: 'Votre progression montre un engagement positif dans l\'apprentissage.'
  };
} 