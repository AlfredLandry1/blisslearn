import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      onboardingCompleted: boolean;
    };
  }

  interface User {
    onboardingCompleted?: boolean;
    image?: string | null;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    onboardingCompleted?: boolean;
    picture?: string | null;
  }
} 