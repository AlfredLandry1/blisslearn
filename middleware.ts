import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  // const { pathname } = request.nextUrl;

  // Vérifier si l'utilisateur est authentifié via les cookies
  const authCookie =
    request.cookies.get("next-auth.session-token") ||
    request.cookies.get("__Secure-next-auth.session-token");

  // Si pas de cookie d'authentification, laisser passer (NextAuth gérera la redirection)
  if (!authCookie) {
    return NextResponse.next();
  }

  // Pour l'instant, on laisse passer toutes les requêtes authentifiées
  // La vérification de l'onboarding se fera côté serveur dans les pages
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/onboarding",
    "/profile/:path*",
    // Ajoutez d'autres routes protégées ici
  ],
};
