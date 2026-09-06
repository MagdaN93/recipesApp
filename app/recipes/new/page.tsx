import { RecipeForm } from "@/app/components/RecipeForm";
import { Difficulty, MealType } from "../../generated/prisma/enums";
import { createRecipe } from "../actions";

export default async function NewRecipePage({ searchParams }: { searchParams: Promise<{ mealType?: MealType }> }) {
    const { mealType } = await searchParams;
    const defaultValues = {
        prepTimeMinutes: 30,
        servings: 2,
        mealType: mealType ?? MealType.dinner,
        difficulty: Difficulty.easy,
        steps: [{ value: "" }],
        ingredients: [{ name: "", amount: "" }],
    };

    return (
        <>
            <h1 className="text-center">Dodaj przepis</h1>
            <RecipeForm onSubmit={createRecipe} defaultValues={defaultValues} cancelHref='/'/>
        </>
    )
}