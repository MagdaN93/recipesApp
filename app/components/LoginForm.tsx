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
import { login, loginAsDemo } from '@/app/auth/actions';
import { LoginSchema, LoginFormInput, LoginFormOutput } from "../auth/schema";

export function LoginForm() {
    const form = useForm<LoginFormInput, unknown, LoginFormOutput>({
        resolver: zodResolver(LoginSchema),
    });

    const onSubmit = async (data: LoginFormOutput) => {
        const result = await login({ email: data.email, password: data.password });

        if (result?.errors) {
            for (const [field, messages] of Object.entries(result.errors)) {
                form.setError(field as keyof LoginFormInput, { message: messages?.[0] });
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
                <Button type="submit">Zaloguj</Button>
            </form>
        </FormProvider>
        <form action={loginAsDemo} className="pb-6">
            <Button type="submit" variant="outline">Wejdź jako demo</Button>
        </form>
        <div className="flex items-center">
            <h4 className="mb-0">Nie masz konta? Załóż </h4>
            <Link
                href={`/register`}
                    className="pl-2 text-lg font-medium text-primary"
                >
                tutaj
            </Link>
        </div>
        </>
    )
}