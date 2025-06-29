import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { randomBytes } from "crypto";
import { sendVerificationEmail } from "@/lib/email";

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { error: "Email requis" },
        { status: 400 }
      );
    }

    // Vérifier si l'utilisateur existe et n'a pas encore vérifié son email
    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        name: true,
        email: true,
        emailVerified: true
      }
    });

    if (!user) {
      return NextResponse.json(
        { error: "Aucun compte trouvé avec cet email" },
        { status: 404 }
      );
    }

    if (user.emailVerified) {
      return NextResponse.json(
        { error: "Cet email est déjà vérifié" },
        { status: 400 }
      );
    }

    // Supprimer l'ancien token s'il existe
    await prisma.verificationtoken.deleteMany({
      where: { identifier: email }
    });

    // Générer un nouveau token
    const token = randomBytes(32).toString("hex");
    const expires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24h

    await prisma.verificationtoken.create({
      data: {
        identifier: email,
        token,
        expires,
      },
    });

    // Envoyer le nouvel email de vérification
    await sendVerificationEmail({
      email: user.email,
      name: user.name || "Utilisateur",
      token,
    });

    console.log(`📧 Email de vérification renvoyé à ${email}`);

    return NextResponse.json({
      message: "Email de vérification renvoyé avec succès",
      sentAt: new Date().toISOString()
    });

  } catch (error) {
    console.error("Erreur lors du renvoi de l'email de vérification:", error);
    return NextResponse.json(
      { error: "Erreur interne du serveur" },
      { status: 500 }
    );
  }
} 