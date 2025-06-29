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

    // Validation basique de l'email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ 
        error: "Format d'email invalide. Veuillez saisir une adresse email valide." 
      }, { status: 400 });
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
      return NextResponse.json({ 
        error: "Aucun compte associé à cette adresse email. Vérifiez votre saisie ou créez un nouveau compte." 
      }, { status: 404 });
    }

    // Vérifier que l'utilisateur a un mot de passe (pas un utilisateur Google sans mot de passe)
    if (!user.password) {
      return NextResponse.json({ 
        error: "Ce compte utilise la connexion Google. Utilisez le bouton 'Se connecter avec Google' pour accéder à votre compte." 
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
        error: "Erreur lors de l'envoi de l'email. Veuillez réessayer plus tard ou contactez notre support." 
      }, { status: 500 });
    }

    return NextResponse.json({ 
      message: "Un email de réinitialisation a été envoyé à votre adresse email. Vérifiez votre boîte de réception et vos spams.",
      success: true
    });

  } catch (error) {
    console.error("Erreur lors de la demande de réinitialisation:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
} 