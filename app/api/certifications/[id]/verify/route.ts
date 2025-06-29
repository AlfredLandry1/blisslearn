import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET - Vérifier une certification en ligne
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Récupérer la certification
    const certification = await prisma.certification.findUnique({
      where: {
        id: params.id
      },
      include: {
        user: {
          select: {
            name: true,
            email: true
          }
        }
      }
    });

    if (!certification) {
      return NextResponse.json({ 
        valid: false, 
        error: "Certification introuvable" 
      }, { status: 404 });
    }

    // Vérifier si la certification est expirée
    const isExpired = certification.expiresAt && new Date(certification.expiresAt) < new Date();
    const isRevoked = certification.status === 'revoked';

    return NextResponse.json({
      valid: !isExpired && !isRevoked,
      certification: {
        id: certification.id,
        title: certification.title,
        certificateNumber: certification.certificateNumber,
        issuedAt: certification.issuedAt,
        expiresAt: certification.expiresAt,
        status: certification.status,
        isVerified: certification.isVerified,
        institution: certification.institution,
        level: certification.level,
        duration: certification.duration,
        recipient: {
          name: certification.user.name,
          email: certification.user.email
        }
      },
      verification: {
        isExpired,
        isRevoked,
        verifiedAt: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error("Erreur lors de la vérification de la certification:", error);
    return NextResponse.json(
      { 
        valid: false,
        error: "Erreur lors de la vérification de la certification" 
      },
      { status: 500 }
    );
  }
} 