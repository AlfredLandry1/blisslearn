import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

const apiKey = process.env.GEMINI_API_KEY;

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const prompt = data.prompt;
    if (!prompt || typeof prompt !== "string" || prompt.length > 2000) {
      return NextResponse.json(
        { error: "Prompt manquant ou trop long." },
        { status: 400 }
      );
    }

    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
    }

    // 1. Sauvegarde le message utilisateur
    await prisma.chat_message.create({
      data: {
        userId: session.user.id,
        role: "user",
        content: prompt,
      },
    });

    // Récupération du contexte utilisateur (comme avant)
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        name: true,
        email: true,
        onboarding: {
          select: {
            isCompleted: true,
            skillLevel: true,
            domainsOfInterest: true,
            learningObjectives: true,
            courseLanguage: true,
            preferredPlatforms: true,
          },
        },
      },
    });

    const userPromptContext = `
**Contexte utilisateur :**
- Prénom : ${user?.name || ""}
- Email : ${user?.email || ""}
- Onboarding complété : ${user?.onboarding?.isCompleted ? "oui" : "non"}
- Niveau : ${user?.onboarding?.skillLevel || ""}
- Domaines d'intérêt : ${user?.onboarding?.domainsOfInterest || ""}
- Objectifs : ${user?.onboarding?.learningObjectives || ""}
- Langue préférée : ${user?.onboarding?.courseLanguage || "français"}
- Plateformes préférées : ${user?.onboarding?.preferredPlatforms || ""}
`;

    const systemPrompt = `
Tu es BlissLearn, l’assistant IA officiel de la plateforme BlissLearn.${userPromptContext}

**Règles de réponse :**
- Toujours répondre en français, de façon professionnelle, bienveillante et concise.
- Ta mission principale est d’aider l’utilisateur à naviguer sur BlissLearn, à comprendre les fonctionnalités, à résoudre les problèmes courants, à s’orienter dans les cours, certifications, notifications, etc.
- Si la question concerne un problème technique, propose une solution simple ou oriente vers le support.
- Si la question sort du contexte BlissLearn, réponds poliment que tu es limité à la plateforme.
- Si tu ne sais pas, dis-le honnêtement et propose de contacter le support.
- Ne donne jamais d’informations confidentielles ou personnelles non autorisées.
- Si l’utilisateur demande un résumé, fais une liste à puces.
- Si l’utilisateur demande un pas-à-pas, fais une liste numérotée.
- Ne propose jamais de fonctionnalités qui n’existent pas sur BlissLearn.
- Si l’utilisateur demande du code, ne donne que ce qui est pertinent pour BlissLearn.
- Si l’utilisateur n’a pas terminé son onboarding, propose-lui de le compléter.

**Format de réponse :**
- Toujours répondre avec un objet JSON valide de la forme :
  {
    "text_content": "ta réponse ici"
  }
`;

    const genAI = new GoogleGenerativeAI(apiKey as string);
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
      systemInstruction: {
        parts: [{ text: systemPrompt }],
        role: "model",
      },
    });

    const parts = [{ text: prompt }];
    const generationConfig = {
      temperature: 1,
      topP: 0.95,
      topK: 64,
      maxOutputTokens: 8192,
      responseMimeType: "application/json",
    };

    const result = await model.generateContent({
      contents: [{ role: "user", parts }],
      generationConfig,
    });

    // Gestion du blockReason (content moderation)
    if (
      result.response.promptFeedback &&
      result.response.promptFeedback.blockReason
    ) {
      return NextResponse.json(
        { error: `Blocked for ${result.response.promptFeedback.blockReason}` },
        { status: 200 }
      );
    }

    // Récupération du texte généré
    let output = "";
    try {
      const text = result.response.candidates?.[0]?.content?.parts?.[0]?.text;
      if (text) {
        const parsed = JSON.parse(text);
        output = parsed.text_content || text;
      } else {
        output = "(Aucune réponse de l'IA)";
      }
    } catch (e) {
      output = "(Erreur de parsing JSON Gemini)";
    }

    // 2. Sauvegarde la réponse IA
    await prisma.chat_message.create({
      data: {
        userId: session.user.id,
        role: "assistant",
        content: output,
      },
    });

    return NextResponse.json({ output });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json(
      { error: error?.message || "Erreur serveur Gemini" },
      { status: 500 }
    );
  }
}

// GET : retourne l'historique du chat de l'utilisateur connecté
export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
  }
  const messages = await prisma.chat_message.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "asc" },
    take: 50,
  });
  return NextResponse.json({ messages });
}

//DEL : supprime l'historique du chat de l'utilisateur connecté
export async function DELETE(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
  }
  await prisma.chat_message.deleteMany({
    where: { userId: session.user.id },
  });
  return NextResponse.json({ success: true });
}
