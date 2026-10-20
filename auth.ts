import NextAuth, { type DefaultSession } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import { z } from "zod";
import { verifyPassword } from "@/lib/password";
import { getUser, saveUser, type Role } from "@/lib/store";

declare module "next-auth" {
  interface Session {
    user: {
      role: Role;
    } & DefaultSession["user"];
  }

  interface User {
    role?: Role;
  }
}

const credentialsSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

const googleEnabled = Boolean(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET);

export const { handlers, auth, signIn, signOut } = NextAuth({
  secret: process.env.NEXTAUTH_SECRET || process.env.AUTH_SECRET,
  trustHost: true,
  session: { strategy: "jwt", maxAge: 60 * 60 * 24 * 30 },
  pages: {
    signIn: "/auth/signin",
  },
  providers: [
    ...(googleEnabled
      ? [
          Google({
            clientId: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
            allowDangerousEmailAccountLinking: true,
          }),
        ]
      : []),
    Credentials({
      name: "Email and password",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(raw) {
        const parsed = credentialsSchema.safeParse(raw);
        if (!parsed.success) return null;
        const user = await getUser(parsed.data.email);
        if (!user || !verifyPassword(parsed.data.password, user.passwordHash)) return null;
        return {
          id: user.email,
          email: user.email,
          name: user.name,
          role: user.role,
        };
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === "google" && user.email) {
        const existing = await getUser(user.email);
        if (!existing) {
          await saveUser({
            email: user.email,
            name: user.name || user.email.split("@")[0],
            role: "farmer",
            provider: "google",
            createdAt: new Date().toISOString(),
          });
        }
      }
      return true;
    },
    async jwt({ token, user }) {
      if (user?.email) {
        const stored = await getUser(user.email);
        token.role = stored?.role ?? user.role ?? "farmer";
        token.email = user.email;
      }
      if (token.email && !token.role) {
        const stored = await getUser(token.email as string);
        token.role = stored?.role ?? "farmer";
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.role = (token.role as Role) || "farmer";
        session.user.email = (token.email as string) || session.user.email;
      }
      return session;
    },
  },
});

export function isOfficer(session: { user?: { role?: Role } } | null): boolean {
  return session?.user?.role === "officer";
}
