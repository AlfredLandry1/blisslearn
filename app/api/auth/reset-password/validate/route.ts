import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get('token');

    if (!token) {
      return NextResponse.json({ error: "Token requis" }, { status: 400 });
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

    return NextResponse.json({
      valid: true,
      user: {
        email: resetToken.user.email,
        name: resetToken.user.name
      }
    });

  } catch (error) {
    console.error("Erreur lors de la validation du token:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
} 