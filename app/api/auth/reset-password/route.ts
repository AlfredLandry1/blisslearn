import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { sendPasswordChangeConfirmationEmail } from "@/lib/email";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { token, password } = body;

    if (!token || !password) {
      return NextResponse.json({ error: "Token et mot de passe requis" }, { status: 400 });
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

    // Vérifier que le token existe et n'est pas expiré
    const resetToken = await prisma.passwordResetToken.findUnique({
      where: { token },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true,
          }
        }
      }
    });

    if (!resetToken) {
      return NextResponse.json({ error: "Token invalide" }, { status: 400 });
    }

    if (resetToken.expiresAt < new Date()) {
      // Supprimer le token expiré
      await prisma.passwordResetToken.delete({
        where: { token }
      });
      return NextResponse.json({ error: "Token expiré" }, { status: 400 });
    }

    // Hasher le nouveau mot de passe
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Mettre à jour le mot de passe de l'utilisateur
    await prisma.user.update({
      where: { id: resetToken.user.id },
      data: {
        password: hashedPassword,
      }
    });

    // Supprimer le token utilisé
    await prisma.passwordResetToken.delete({
      where: { token }
    });

    // Supprimer tous les autres tokens de réinitialisation pour cet utilisateur
    await prisma.passwordResetToken.deleteMany({
      where: { userId: resetToken.user.id }
    });

    // Envoyer l'email de confirmation
    try {
      await sendPasswordChangeConfirmationEmail({
        email: resetToken.user.email!,
        name: resetToken.user.name || "Utilisateur",
        loginUrl: `${process.env.NEXTAUTH_URL}/auth/login`
      });
    } catch (emailError) {
      console.error("Erreur lors de l'envoi de l'email de confirmation:", emailError);
      // On ne fait pas échouer la réinitialisation si l'email de confirmation échoue
    }

    return NextResponse.json({
      message: "Mot de passe réinitialisé avec succès. Un email de confirmation vous a été envoyé.",
      success: true
    });

  } catch (error) {
    console.error("Erreur lors de la réinitialisation du mot de passe:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
} 