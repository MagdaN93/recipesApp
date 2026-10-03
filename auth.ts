import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import prisma from "@/app/lib/prisma";

export const { handlers, auth, signIn, signOut } = NextAuth({
    session: { strategy: "jwt" },
    providers: [
        Credentials({
            credentials: {
                email: {},
                password: {},
            },
            authorize: async (credentials) => {
                const email = String(credentials.email ?? "").trim().toLowerCase();
                const password = String(credentials.password ?? "");

                if (!email || !password) return null;

                const user = await prisma.user.findUnique({ where: { email } });
                if (!user) return null;

                const passwordsMatch = await bcrypt.compare(password, user.passwordHash);
                if (!passwordsMatch) return null;

                return { id: user.id, email: user.email };
            },
        }),
    ],
});
