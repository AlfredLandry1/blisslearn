import {
  type NextAuthOptions,
  type SessionStrategy,
  type User,
  type Account,
  type Profile,
  type Session,
} from "next-auth";
import type { JWT } from "next-auth/jwt";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import { compare } from "bcryptjs";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: {
          label: "Email",
          type: "email",
          placeholder: "votre@email.com",
        },
        password: { label: "Mot de passe", type: "password" },
      },
      async authorize(credentials) {
        try {
          if (!credentials?.email || !credentials?.password) {
            return null;
          }
          const user = await prisma.user.findUnique({
            where: { email: credentials.email as string },
            select: {
              id: true,
              email: true,
              name: true,
              password: true,
              onboardingCompleted: true,
            },
          });
          if (
            !user ||
            typeof user.password !== "string" ||
            typeof credentials.password !== "string"
          ) {
            return null;
          }
          const isValid = await compare(credentials.password, user.password);
          if (!isValid) {
            return null;
          }
          return {
            id: user.id,
            email: user.email ?? undefined,
            name: user.name ?? undefined,
            onboardingCompleted: user.onboardingCompleted,
          };
        } catch (error) {
          return null;
        }
      },
    }),
  ],
  session: {
    strategy: "jwt" as SessionStrategy,
    maxAge: 30 * 24 * 60 * 60,
    updateAge: 24 * 60 * 60,
  },
  pages: {
    signIn: "/auth/login",
    error: "/auth/error",
  },
  callbacks: {
    async signIn({ user, accounts, profile }: any) {
      if (accounts?.provider === "google") {
        try {
          await prisma.user.update({
            where: { email: user.email! },
            data: { 
              provider: "google",
              emailVerified: new Date()
            }
          });
        } catch (error) {
          console.error("Erreur lors de la mise à jour du provider:", error);
        }
        
        const existingUser = await prisma.user.findUnique({
          where: { email: user.email! },
          include: { accounts: true }
        });
        const hasGoogle = existingUser?.accounts.some((acc: any) => acc.provider === "google");
        if (existingUser && !hasGoogle) {
          return true;
        }
      }
      return true;
    },
    async jwt({
      token,
      user,
      account,
      profile,
    }: {
      token: JWT;
      user?: User;
      account?: Account | null;
      profile?: Profile;
    }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
        token.picture = user.image;
        
        if (account?.provider === "google") {
          await prisma.user.update({
            where: { email: user.email! },
            data: { 
              provider: "google",
              emailVerified: new Date()
            }
          });
        }
        
        // Récupérer les informations complètes de l'utilisateur
        const userData = await prisma.user.findUnique({
          where: { id: user.id },
          select: { 
            onboardingCompleted: true,
            emailVerified: true
          }
        });
        
        token.onboardingCompleted = userData?.onboardingCompleted ?? false;
        token.emailVerified = userData?.emailVerified ?? null;
      }
      return token;
    },
    async session({ session, token }: { session: Session; token: JWT }) {
      if (token) {
        session.user.id = token.id as string;
        session.user.email = token.email as string;
        session.user.name = token.name as string;
        session.user.image = token.picture as string;
        session.user.onboardingCompleted = token.onboardingCompleted as boolean;
        session.user.emailVerified = token.emailVerified as Date | null;
      }
      return session;
    },
  },
  events: {
    async signIn({ user, account, profile, isNewUser }) {
      if (account?.provider && user.email) {
        const emailVerified = account.provider === "google" ? new Date() : null;
        
        await prisma.user.update({
          where: { email: user.email },
          data: { 
            provider: account.provider,
            emailVerified: emailVerified
          }
        });
      }
    },
    async createUser({ user }) {
      if (user.email) {
        // Le provider sera mis à jour dans le callback signIn
      }
    },
    async linkAccount() {},
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === "development",
}; 