import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import crypto from "crypto";
import { sendPasswordResetEmail } from "@/lib/email";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email } = body;

    if (!email) {
      return NextResponse.json({ error: "Email requis" }, { status: 400 });
    }

    // Vérifier que l'utilisateur existe
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
      select: {
        id: true,
        email: true,
        name: true,
        password: true, // Pour vérifier qu'il a un mot de passe
      }
    });

    if (!user) {
      // Pour des raisons de sécurité, on ne révèle pas si l'email existe ou non
      return NextResponse.json({ 
        message: "Si cet email existe dans notre base de données, vous recevrez un lien de réinitialisation." 
      });
    }

    // Vérifier que l'utilisateur a un mot de passe (pas un utilisateur Google sans mot de passe)
    if (!user.password) {
      return NextResponse.json({ 
        error: "Ce compte utilise la connexion Google. Utilisez le bouton 'Se connecter avec Google'." 
      }, { status: 400 });
    }

    // Générer un token unique
    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetTokenExpiry = new Date(Date.now() + 60 * 60 * 1000); // 1 heure

    // Supprimer les anciens tokens de réinitialisation pour cet utilisateur
    await prisma.$executeRaw`DELETE FROM passwordResetToken WHERE userId = ${user.id}`;

    // Créer un nouveau token de réinitialisation
    await prisma.$executeRaw`
      INSERT INTO passwordResetToken (id, token, userId, expiresAt, createdAt)
      VALUES (${crypto.randomBytes(16).toString('hex')}, ${resetToken}, ${user.id}, ${resetTokenExpiry}, NOW())
    `;

    // Envoyer l'email de réinitialisation
    try {
      await sendPasswordResetEmail({
        email: user.email!,
        name: user.name || "Utilisateur",
        token: resetToken,
        resetUrl: `${process.env.NEXTAUTH_URL}/auth/reset-password?token=${resetToken}`
      });
    } catch (emailError) {
      console.error("Erreur lors de l'envoi de l'email:", emailError);
      // Supprimer le token si l'email n'a pas pu être envoyé
      await prisma.$executeRaw`DELETE FROM passwordResetToken WHERE token = ${resetToken}`;
      return NextResponse.json({ 
        error: "Erreur lors de l'envoi de l'email. Veuillez réessayer plus tard." 
      }, { status: 500 });
    }

    return NextResponse.json({ 
      message: "Si cet email existe dans notre base de données, vous recevrez un lien de réinitialisation." 
    });

  } catch (error) {
    console.error("Erreur lors de la demande de réinitialisation:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
} 