"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, FormProvider } from "react-hook-form";
import {
  Field,
  FieldLabel,
  FieldError,
} from "@/components/ui/field";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { signup } from '@/app/auth/actions';
import { RegistrationSchema, RegistrationFormInput, RegistrationFormOutput } from "../auth/schema";

export function RegistrationForm() {
    const form = useForm<RegistrationFormInput, unknown, RegistrationFormOutput>({
        resolver: zodResolver(RegistrationSchema),
    });

    const onSubmit = async (data: RegistrationFormOutput) => {
        const result = await signup({ email: data.email, password: data.password, replypassword: data.replypassword });

        if (result?.errors) {
            for (const [field, messages] of Object.entries(result.errors)) {
                form.setError(field as keyof RegistrationFormInput, { message: messages?.[0] });
            }
        }
    };

    return (
        <>
        <FormProvider {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 py-10">
                <Field>
                    <FieldLabel htmlFor="email">Email</FieldLabel>
                    <Input 
                        id="email"
                        type="email"
                        placeholder="abc@example.com"
                        
                        {...form.register("email")}
                    />
                    
                    <FieldError>{form.formState.errors.email?.message}</FieldError>
                </Field>
                <Field>
                    <FieldLabel htmlFor="password">Hasło</FieldLabel>
                    <Input 
                        id="password"
                        type="password"
                        placeholder="Wpisz hasło"
                        
                        {...form.register("password")}
                    />
                    
                    <FieldError>{form.formState.errors.password?.message}</FieldError>
                </Field>
                <Field>
                    <FieldLabel htmlFor="replypassword">Powtórz hasło</FieldLabel>
                    <Input 
                        id="replypassword"
                        type="password"
                        placeholder="Powtórz hasło"
                        
                        {...form.register("replypassword")}
                    />

                    <FieldError>{form.formState.errors.replypassword?.message}</FieldError>
                </Field>
                <Button type="submit">Stwórz konto</Button>
            </form>
        </FormProvider>
        <div className="flex items-center">
            <h4 className="mb-0">Masz już konto?</h4>
            <Link
                href={`/login`}
                    className="pl-2 text-lg font-medium text-blue-700"
                >
                Zaloguj się
            </Link>
        </div>
        </>
    )
}