import Link from "next/link";
import prisma from "./lib/prisma";
import { Prisma } from "./generated/prisma/client";
import { MealType } from "./generated/prisma/enums";

import { CategoryNav } from "./components/CategoryNav";
import { SearchPanel } from "./components/SearchPanel/SearchPanel";
import { findRecipesByIngredients } from "./recipes/queries";
import { Check, X } from "lucide-react";

export default async function Home({ searchParams }: { searchParams: Promise<{ mealType?: MealType, name?: string, maxTime?: string, ingredients?: string }> }) {
    const { mealType, name, maxTime, ingredients } = await searchParams;
    const defaultMealType = mealType ?? MealType.dinner;
    const ingredientsArr = ingredients?.split(",").filter(Boolean) ?? [];
    let recipes: { id: string; title: string; matched?: number, missing?: number }[];

    const maxTimeMinutes = Number(maxTime);

    const where: Prisma.RecipeWhereInput = {
        mealType: defaultMealType,
        ...(name && {title: {contains: name, mode: "insensitive"}}),
        ...(maxTime && Number.isFinite(maxTimeMinutes) && {prepTimeMinutes: { lte: maxTimeMinutes}})
    };

    if (ingredientsArr.length > 0) {
        recipes = await findRecipesByIngredients(where, ingredientsArr);
    } else {
        const plainRecipes = await prisma.recipe.findMany({
            where: where,
            orderBy: { createdAt: "asc" }
        });
        recipes = plainRecipes.map((recipe) => ({ id: recipe.id, title: recipe.title }));
    }

    return (
        <div className="flex flex-col items-center gap-6 text-center sm:items-start sm:text-left">
            <CategoryNav />
            <SearchPanel />
            <Link
                href={`/recipes/new?mealType=${defaultMealType}`}
                className="rounded-md bg-black px-4 py-2 text-lg font-medium text-white dark:bg-white dark:text-black"
            >
                Dodaj nowy przepis
            </Link>
            {recipes.length === 0 ? (
                <p className="text-lg text-center self-center">Brak wyników</p>
            ) : (
            <ol>
                {recipes.map((recipe) =>
                    <li key={recipe.id}>
                        <Link href={`/recipes/${recipe.id}`}>{recipe.title}</Link>
                        {recipe.matched !== undefined && recipe.missing !== undefined &&
                            <div className="flex">
                                <span className="flex items-center text-green-600"><Check className="size-4"/> {recipe.matched}</span>
                                {recipe.missing > 0 && <span className="flex items-center text-red-600 ml-2"><X className="size-4"/> {recipe.missing}</span>}
                            </div>
                        }
                    </li>
                )}
            </ol>
            )}
        </div>
    );
}