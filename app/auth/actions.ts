"use server";

import { z } from "zod";
import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";
import { signIn, signOut } from "@/auth";
import { AuthError } from "next-auth"
import prisma from "@/app/lib/prisma";
import { Prisma } from "../generated/prisma/client";
import { LoginSchema, RegistrationSchema } from "./schema";
import { DEMO_EMAIL, DEMO_PASSWORD } from "./demo";

export async function signup(data: { email: string; password: string, replypassword: string }) {
    const validatedFields = RegistrationSchema.safeParse({
        email: data.email,
        password: data.password,
        replypassword: data.replypassword,

    });

    if (!validatedFields.success) {
        return {
            errors: z.flattenError(validatedFields.error).fieldErrors,
        }
    }
    const { email, password } = validatedFields.data;

    try {
        await prisma.user.create({
            data: {
                email: email,
                passwordHash: await bcrypt.hash(password, 10),
            },
        });        
    }
    catch(error){ 
        if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
            return { errors: { email: ["Ten adres email jest już zajęty"] } };
        }
        throw error;
    }

    redirect(`/login`);    
}

export async function login(data: { email: string; password: string }) {
    const validatedFields = LoginSchema.safeParse({
        email: data.email,
        password: data.password

    });

    if (!validatedFields.success) {
        return {
            errors: z.flattenError(validatedFields.error).fieldErrors,
        }
    }
    const { email, password } = validatedFields.data;

    try {
        await signIn("credentials", { email, password, redirectTo: "/" });        
    }
    catch(error){ 
        if (error instanceof AuthError) {
            return { errors: { password: ["Nieprawidłowy email lub hasło"] } };
        }
        throw error;
    }
}

export async function loginAsDemo() {
    await signIn("credentials", { email: DEMO_EMAIL, password: DEMO_PASSWORD, redirectTo: "/" });
}

export async function logout() {
    await signOut({ redirectTo: "/login" });
}
