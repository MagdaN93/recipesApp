"use client"

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller, FormProvider } from "react-hook-form";
import Link from "next/link";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import {
  Field,
  FieldLabel,
  FieldError,
  FieldSeparator
} from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Difficulty, MealType } from "../generated/prisma/enums";
import { IngredientsField } from "./IngredientsField";
import { StepsField } from "./StepsField";

const ingredient = z.object({
  name: z.string().min(1, "Nazwa składnika wymagana"),
  amount: z.string(),
});
const step = z.object({
    value: z.string().min(1)
});

const RecipeSchema = z.object({
    title: z.string().min(1, "Nazwa przepisu wymagana"),
    difficulty: z.enum(Difficulty),
    mealType: z.enum(MealType),
    prepTimeMinutes: z.coerce.number().positive(),
    servings: z.coerce.number().positive(),
    steps: z.array(step).min(1, "Wymagany przynajmniej 1 krok"),
    ingredients: z.array(ingredient).min(1, 'Wymagany przynajmniej 1 składnik')
});

export type RecipeFormInput = z.input<typeof RecipeSchema>;
export type RecipeFormOutput = z.output<typeof RecipeSchema>;

interface RecipeFormProps {
    defaultValues: Partial<RecipeFormInput>;
    onSubmit: (values: RecipeFormOutput) => void;
    cancelHref: string;
};

export function RecipeForm({onSubmit, defaultValues, cancelHref}:RecipeFormProps) {
    const form = useForm<RecipeFormInput, unknown, RecipeFormOutput>({
        resolver: zodResolver(RecipeSchema),
        defaultValues: defaultValues,
    });

    return (
        <FormProvider {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 py-10">
                <Field>
                    <FieldLabel htmlFor="title">Nazwa</FieldLabel>
                    <Input 
                        id="title" 
                        placeholder="Nazwa przepisu"
                        
                        {...form.register("title")}
                    />
                    
                    <FieldError>{form.formState.errors.title?.message}</FieldError>
                </Field>
                <FieldSeparator />
                <Field className="mt-4">
                    <FieldLabel htmlFor="difficulty">Trudność</FieldLabel>
                        <Controller
                        control={form.control}
                        name="difficulty"
                        render={({ field }) => (
                            <Select onValueChange={field.onChange} value={field.value}>
                                <SelectTrigger id="difficulty">
                                    <SelectValue placeholder="Wybierz trudność przepisu" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value={Difficulty.easy}>{Difficulty.easy}</SelectItem>
                                    <SelectItem value={Difficulty.medium}>{Difficulty.medium}</SelectItem>
                                    <SelectItem value={Difficulty.hard}>{Difficulty.hard}</SelectItem>
                                </SelectContent>
                            </Select>
                        )}/>
                    <FieldError>{form.formState.errors.difficulty?.message}</FieldError>
                </Field>
                <FieldSeparator />
                <Field className="mt-4">
                    <FieldLabel htmlFor="mealType">Kategoria</FieldLabel>
                    <Controller
                        control={form.control}
                        name="mealType"
                        render={({ field }) => (
                            <Select onValueChange={field.onChange} value={field.value}>
                                <SelectTrigger id="mealType">
                                    <SelectValue placeholder="Wybierz kategorię" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value={MealType.breakfast}>{MealType.breakfast}</SelectItem>
                                    <SelectItem value={MealType.dinner}>{MealType.dinner}</SelectItem>
                                    <SelectItem value={MealType.dessert}>{MealType.dessert}</SelectItem>
                                    <SelectItem value={MealType.supper}>{MealType.supper}</SelectItem>
                                    <SelectItem value={MealType.snack}>{MealType.snack}</SelectItem>
                                </SelectContent>
                            </Select>
                        )}/>
                    <FieldError>{form.formState.errors.mealType?.message}</FieldError>
                </Field>
                <FieldSeparator />
                <Field className="mt-4">
                    <FieldLabel htmlFor="prepTimeMinutes">Czas wykonania w minutach</FieldLabel>
                    <Input 
                        id="prepTimeMinutes"
                        type="number"
                        placeholder="Czas wykonania w minutach"
                        
                        {...form.register("prepTimeMinutes")}
                    />
                    <FieldError>{form.formState.errors.prepTimeMinutes?.message}</FieldError>
                </Field>
                <FieldSeparator />
                <Field className="mt-4">
                    <FieldLabel htmlFor="servings">Liczba porcji</FieldLabel>
                    <Input 
                        id="servings"
                        type="number"
                        placeholder="Liczba porcji"
                        {...form.register("servings")}
                    />
                    
                    <FieldError>{form.formState.errors.servings?.message}</FieldError>
                </Field>
                <FieldSeparator />
                <IngredientsField />
                <StepsField />
                <Button type="submit" className="mt-4">Zapisz</Button>
                <Button variant="outline" render={<Link href={cancelHref} />} nativeButton={false}>Anuluj</Button>
            </form>
        </FormProvider>
    )
}