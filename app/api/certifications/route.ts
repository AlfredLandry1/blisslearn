import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from '@/app/api/auth/[...nextauth]/authOptions';

export async function GET(request: NextRequest) {
  try {
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

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '20', 10);
    const offset = (page - 1) * limit;
    
    // Filtres optionnels
    const status = searchParams.get('status');
    
    // Construction des conditions de filtrage
    const where: any = { userId: user.id };
    
    if (status && status !== 'all') {
      where.status = status;
    }

    // Récupération des certifications avec pagination
    const [certifications, totalCertifications] = await Promise.all([
      prisma.certification.findMany({
        where,
        include: {
          course: {
            select: {
              title: true,
              platform: true,
              level_normalized: true,
              duration_hours: true,
              category: true
            }
          }
        },
        orderBy: { issuedAt: 'desc' },
        take: limit,
        skip: offset,
      }),
      prisma.certification.count({ where })
    ]);

    // Calculer les statistiques
    const stats = await prisma.certification.groupBy({
      by: ['status'],
      where: { userId: user.id },
      _count: { status: true }
    });

    const activeCount = stats.find(s => s.status === 'active')?._count.status || 0;
    const expiredCount = stats.find(s => s.status === 'expired')?._count.status || 0;
    const revokedCount = stats.find(s => s.status === 'revoked')?._count.status || 0;

    const totalPages = Math.ceil(totalCertifications / limit);
    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;

    return NextResponse.json({
      certifications,
      pagination: {
        currentPage: page,
        totalPages,
        totalItems: totalCertifications,
        itemsPerPage: limit,
        hasNextPage,
        hasPrevPage,
        nextPage: hasNextPage ? page + 1 : null,
        prevPage: hasPrevPage ? page - 1 : null,
      },
      stats: {
        total: totalCertifications,
        active: activeCount,
        expired: expiredCount,
        revoked: revokedCount
      }
    });
  } catch (error) {
    console.error("Erreur lors de la récupération des certifications:", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération des certifications" },
      { status: 500 }
    );
  }
}

// POST - Créer une nouvelle certification (pour les tests ou l'administration)
export async function POST(request: NextRequest) {
  try {
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

    const body = await request.json();
    const { 
      courseId, 
      progressId, 
      title, 
      description, 
      certificateNumber,
      courseTitle,
      institution,
      level,
      duration,
      timeSpent,
      completionDate,
      expiresAt 
    } = body;

    if (!courseId || !progressId || !title || !certificateNumber || !courseTitle) {
      return NextResponse.json({ error: "Données manquantes" }, { status: 400 });
    }

    const certification = await prisma.certification.create({
      data: {
        userId: user.id,
        courseId: parseInt(courseId),
        progressId,
        title,
        description,
        certificateNumber,
        courseTitle,
        institution,
        level,
        duration,
        timeSpent,
        completionDate: new Date(completionDate),
        expiresAt: expiresAt ? new Date(expiresAt) : null,
        status: "active",
        isVerified: true
      },
      include: {
        course: {
          select: {
            title: true,
            platform: true,
            level_normalized: true,
            duration_hours: true,
            category: true
          }
        }
      }
    });

    return NextResponse.json(certification);
  } catch (error) {
    console.error("Erreur lors de la création de la certification:", error);
    return NextResponse.json(
      { error: "Erreur lors de la création de la certification" },
      { status: 500 }
    );
  }
} 