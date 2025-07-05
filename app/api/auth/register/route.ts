import { NextResponse } from "next/server";
import { hash } from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { randomBytes } from "crypto";
import { sendVerificationEmail } from "@/lib/email";

export async function POST(request: Request) {
  try {
    const { name, email, password } = await request.json();

    // Validation des données
    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "Tous les champs sont requis" },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: "Le mot de passe doit contenir au moins 6 caractères" },
        { status: 400 }
      );
    }

    // Vérifier si l'utilisateur existe déjà
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "Un utilisateur avec cet email existe déjà" },
        { status: 409 }
      );
    }

    // Hasher le mot de passe
    const hashedPassword = await hash(password, 12);

    // Cas spécial pour l'admin de test
    let emailVerified: Date | null = null;
    if (email === "alfred@test.mail") {
      emailVerified = new Date();
    }

    // Créer l'utilisateur
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        emailVerified,
      },
      select: {
        id: true,
        name: true,
        email: true,
        emailVerified: true,
      },
    });

    // Si ce n'est pas l'admin de test, envoyer l'email de vérification
    if (email !== "alfred@test.mail") {
      console.log("📧 Tentative d'envoi d'email de vérification pour:", email);
      console.log("🔑 RESEND_API_KEY configurée:", !!process.env.RESEND_API_KEY);
      console.log("🌐 NEXTAUTH_URL:", process.env.NEXTAUTH_URL);
      
      // Générer un token unique
      const token = randomBytes(32).toString("hex");
      const expires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24h
      
      try {
        await prisma.verificationtoken.create({
          data: {
            identifier: email,
            token,
            expires,
          },
        });
        console.log("✅ Token de vérification créé en base");
        
        // Envoyer l'email de vérification
        await sendVerificationEmail({
          email,
          name,
          token,
        });
        console.log("✅ Email de vérification envoyé avec succès");
      } catch (emailError) {
        console.error("❌ Erreur lors de l'envoi de l'email de vérification:", emailError);
        // Ne pas faire échouer l'inscription si l'email échoue
        // L'utilisateur pourra demander un nouvel email de vérification
      }
    }

    return NextResponse.json(
      {
        message: "Utilisateur créé avec succès",
        user,
        verificationRequired: email !== "alfred@test.mail",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Erreur lors de l'inscription:", error);
    return NextResponse.json(
      { error: "Erreur interne du serveur" },
      { status: 500 }
    );
  }
} 