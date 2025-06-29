import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const body = await request.json();
    const { password } = body;

    if (!password) {
      return NextResponse.json({ error: "Mot de passe requis" }, { status: 400 });
    }

    // Validation du mot de passe
    if (password.length < 8) {
      return NextResponse.json({ 
        error: "Le mot de passe doit contenir au moins 8 caractères" 
      }, { status: 400 });
    }

    if (!/[a-z]/.test(password)) {
      return NextResponse.json({ 
        error: "Le mot de passe doit contenir au moins une lettre minuscule" 
      }, { status: 400 });
    }

    if (!/[A-Z]/.test(password)) {
      return NextResponse.json({ 
        error: "Le mot de passe doit contenir au moins une lettre majuscule" 
      }, { status: 400 });
    }

    if (!/[0-9]/.test(password)) {
      return NextResponse.json({ 
        error: "Le mot de passe doit contenir au moins un chiffre" 
      }, { status: 400 });
    }

    // Récupérer l'utilisateur
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: {
        id: true,
        email: true,
        password: true,
        provider: true,
      }
    });

    if (!user) {
      return NextResponse.json({ error: "Utilisateur non trouvé" }, { status: 404 });
    }

    // Vérifier que l'utilisateur est un utilisateur Google
    const isGoogleUser = user.provider === "google";
    
    if (!isGoogleUser) {
      return NextResponse.json({ 
        error: "Cette fonctionnalité n'est disponible que pour les utilisateurs Google" 
      }, { status: 400 });
    }

    // Vérifier que l'utilisateur n'a pas déjà un mot de passe
    if (user.password) {
      return NextResponse.json({ 
        error: "Un mot de passe est déjà configuré pour ce compte" 
      }, { status: 400 });
    }

    // Hasher le mot de passe
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Mettre à jour l'utilisateur avec le mot de passe
    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
      }
    });

    return NextResponse.json({
      message: "Mot de passe configuré avec succès",
      success: true
    });

  } catch (error) {
    console.error("Erreur lors de la configuration du mot de passe:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
} 