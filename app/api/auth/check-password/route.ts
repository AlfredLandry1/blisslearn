import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: {
        id: true,
        email: true,
        password: true,
        provider: true,
        image: true,
      }
    });

    if (!user) {
      return NextResponse.json({ error: "Utilisateur non trouvé" }, { status: 404 });
    }

    // Déterminer si l'utilisateur est un utilisateur Google
    const isGoogleUser = user.provider === "google" || user.image?.includes("googleusercontent.com");
    
    // Vérifier si l'utilisateur a un mot de passe
    const hasPassword = !!user.password;
    
    // Déterminer si l'utilisateur a besoin de configurer un mot de passe
    const needsPasswordSetup = isGoogleUser && !hasPassword;

    return NextResponse.json({
      hasPassword,
      isGoogleUser,
      needsPasswordSetup,
      provider: user.provider
    });

  } catch (error) {
    console.error("Erreur lors de la vérification du mot de passe:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
} 