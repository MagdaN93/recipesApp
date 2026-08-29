"use client"

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import {
  Field,
  FieldLabel,
  FieldError,
  FieldSeparator
} from "@/components/ui/field"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Difficulty, MealType } from "../../generated/prisma/enums";
import { createRecipe } from "../actions";
import { IngredientCombobox } from "@/app/components/IngredientCombobox";

const ingredient = z.object({
  name: z.string().min(1, "Nazwa składnika wymagana"),
  amount: z.string().min(1, "Ilość wymagana"),
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

type RecipeFormInput = z.input<typeof RecipeSchema>;
type RecipeFormOutput = z.output<typeof RecipeSchema>;

export default function NewRecipePage() {
    const form = useForm<RecipeFormInput, unknown, RecipeFormOutput>({
        resolver: zodResolver(RecipeSchema),
        defaultValues: {
            prepTimeMinutes: 30,
            servings: 2,
            mealType: MealType.dinner,
            difficulty: Difficulty.easy,
            steps: [{ value: "" }],
            ingredients: [{ name: "", amount: "" }],
        },
    });

    const { fields: stepFields, append: appendSteps, remove: removeSteps } = useFieldArray({ 
        control: form.control,
        name: "steps"
    });

    const { fields: ingredientFields, append: appendIngredient, remove: removeIngredient } = useFieldArray({
        control: form.control,
        name: "ingredients"
    });

    function onSubmit(values: RecipeFormOutput ) {
       createRecipe(values);
    }

    return (
        <>
            <h1 className="text-center">Dodaj przepis</h1>
         
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 max-w-3xl mx-auto py-10">
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
                                <Select onValueChange={field.onChange}>
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
                                <Select onValueChange={field.onChange}>
                                    <SelectTrigger id="mealType">
                                        <SelectValue placeholder="Wybierz kategorię" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value={MealType.breakfast}>{MealType.breakfast}</SelectItem>
                                        <SelectItem value={MealType.dinner}>{MealType.dinner}</SelectItem>
                                        <SelectItem value={MealType.dessert}>{MealType.dessert}</SelectItem>
                                        <SelectItem value={MealType.supper}>{MealType.supper}</SelectItem>
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
                    <FieldLabel className="mt-4">Dodaj składniki:</FieldLabel>
                    {ingredientFields.map((ingredient, index) => 
                        <div key={ingredient.id} className="flex items-center gap-2">
                            {/*<Input 
                                type="text"
                                placeholder="Składnik"
                                {...form.register(`ingredients.${index}.name`)}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter") {
                                        e.preventDefault();
                                        appendIngredient({ name: "", amount: "" });
                                    }
                                }}
                                list='ingredientsList'
                            />*/}
                            <IngredientCombobox/>
                            <Input
                                type="text"
                                placeholder="Ilość"
                                {...form.register(`ingredients.${index}.amount`)}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter") {
                                        e.preventDefault();
                                        appendIngredient({ name: "", amount: "" });
                                    }
                                }}
                            />
                            {ingredientFields.length > 1 && (
                                <Button type="button" onClick={() => removeIngredient(index)}>Usuń składnik</Button>
                            )}
                        </div>
                    )}
                    <FieldError>{form.formState.errors.ingredients?.message}</FieldError>
                    <Button type="button" onClick={() => appendIngredient({ name: "", amount: "" })}>Dodaj następny krok</Button>
                    <FieldSeparator />
                    <FieldLabel className="mt-4">Dodaj kroki:</FieldLabel>
                    {stepFields.map((step, index) =>
                        <div key={step.id} className="flex items-center gap-2">
                            <Input
                                type="text"
                                placeholder={`Krok ${index+1}`}
                                {...form.register(`steps.${index}.value`)}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter") {
                                        e.preventDefault();
                                        appendSteps({ value: "" });
                                    }
                                }}
                            />
                            {stepFields.length > 1 && (
                                <Button type="button" onClick={() => removeSteps(index)}>Usuń krok</Button>
                            )}
                        </div>
                    )}
                    <FieldError>{form.formState.errors.steps?.message}</FieldError>
                    <Button type="button" onClick={() => appendSteps({ value: "" })}>Dodaj następny krok</Button>
                    <FieldSeparator />
                    <Button type="submit" className="mt-4">Zapisz</Button>
                </form>
        </>
    )
}