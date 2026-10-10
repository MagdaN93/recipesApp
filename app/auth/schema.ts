import { z } from "zod";
import { normalizeEmail } from "../tools/normalizeEmail";

export const RegistrationSchema = z.object({
    email: z.string().transform(normalizeEmail).pipe(z.email("Podaj poprawny adres email.")),
    password: z.string().min(6, "Hasło musi zawierać min 6 znaków"),
    replypassword: z.string()
}).refine((obj) => obj.password === obj.replypassword, {
    message: "Hasła nie są takie same",
    path: ["replypassword"]
});

export type RegistrationFormInput = z.input<typeof RegistrationSchema>;
export type RegistrationFormOutput = z.output<typeof RegistrationSchema>;


export const LoginSchema = z.object({
    email: z.string().transform(normalizeEmail).pipe(z.email("Podaj poprawny adres email.")),
    password: z.string().min(1, "Wpisz hasło"),
});

export type LoginFormInput = z.input<typeof LoginSchema>;
export type LoginFormOutput = z.output<typeof LoginSchema>;