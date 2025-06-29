import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Vérifier si l'utilisateur est authentifié via les cookies
  const authCookie =
    request.cookies.get("next-auth.session-token") ||
    request.cookies.get("__Secure-next-auth.session-token");

  // Si pas de cookie d'authentification, laisser passer (NextAuth gérera la redirection)
  if (!authCookie) {
    return NextResponse.next();
  }

  // Vérifier le token JWT pour obtenir les informations de l'utilisateur
  const token = await getToken({ req: request });
  
  if (token) {
    // Vérifier si l'email est vérifié
    const emailVerified = token.emailVerified as Date | null;
    const email = token.email as string;

    // Si l'email n'est pas vérifié et que ce n'est pas l'admin de test
    if (!emailVerified && email !== "alfred@test.mail") {
      // Rediriger vers la page de vérification d'email
      const verifyUrl = new URL("/auth/verify-email", request.url);
      return NextResponse.redirect(verifyUrl);
    }
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
