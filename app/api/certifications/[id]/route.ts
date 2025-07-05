import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from '@/app/api/auth/[...nextauth]/authOptions';

// GET - Récupérer une certification spécifique
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    });

    if (!user) {
      return NextResponse.json({ error: "Utilisateur introuvable" }, { status: 404 });
    }

    // Récupérer la certification et vérifier qu'elle appartient à l'utilisateur
    const certification = await prisma.certification.findFirst({
      where: {
        id: id,
        userId: user.id
      }
    });

    if (!certification) {
      return NextResponse.json({ error: "Certification introuvable" }, { status: 404 });
    }

    return NextResponse.json(certification);
  } catch (error) {
    console.error("Erreur lors de la récupération de la certification:", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération de la certification" },
      { status: 500 }
    );
  }
} 