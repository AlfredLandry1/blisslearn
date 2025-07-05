import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const courseId = parseInt(id);
    
    if (isNaN(courseId)) {
      return NextResponse.json({ error: "ID de cours invalide" }, { status: 400 });
    }

    const course = await prisma.course.findUnique({
      where: { id: courseId }
    });

    if (!course) {
      return NextResponse.json({ error: "Cours non trouvé" }, { status: 404 });
    }

    return NextResponse.json(course);
  } catch (error) {
    console.error("Erreur lors de la récupération du cours:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
} 