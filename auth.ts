import NextAuth, { DefaultSession } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import type { Role } from "@/app/generated/prisma/enums";
import prisma from "@/app/lib/prisma";
import { normalizeEmail } from "./app/tools/normalizeEmail";

declare module "next-auth" {
    interface User {
        role: Role;
    }
    interface Session {
        user: { id: string; role: Role } & DefaultSession["user"];
    }
}

declare module "@auth/core/jwt" {
    interface JWT {
        id: string;
        role: Role;
    }
}

export const { handlers, auth, signIn, signOut } = NextAuth({
    session: { strategy: "jwt" },
    providers: [
        Credentials({
            credentials: {
                email: {},
                password: {},
            },
            authorize: async (credentials) => {
                const email = normalizeEmail(String(credentials.email ?? ""));
                const password = String(credentials.password ?? "");

                if (!email || !password) return null;

                const user = await prisma.user.findUnique({ where: { email } });
                if (!user) return null;

                const passwordsMatch = await bcrypt.compare(password, user.passwordHash);
                if (!passwordsMatch) return null;

                return { id: user.id, email: user.email, role: user.role };
            },
        }),
    ],
    callbacks: {
        jwt({ token, user }) {
            if (user) {
                token.id = user.id!;
                token.role = user.role;
            }
            return token;
        },
        session({ session, token }) {
            session.user.id = token.id;
            session.user.role = token.role;
            return session;
        },
    }
});
