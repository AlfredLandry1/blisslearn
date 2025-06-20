import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const courses = await prisma.course.findMany({ orderBy: { title: "asc" } });
    return NextResponse.json({ courses });
  } catch (e) {
    return NextResponse.json({ error: "Erreur lors du chargement des cours" }, { status: 500 });
  }
} 