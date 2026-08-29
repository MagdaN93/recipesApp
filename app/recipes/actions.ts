"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import prisma from "@/app/lib/prisma";
import { Difficulty, MealType } from "@/app/generated/prisma/enums";

type CreateRecipeInput = {
  title: string;
  difficulty: Difficulty;
  mealType: MealType;
  prepTimeMinutes: number;
  servings: number;
  steps: { value: string }[];
  ingredients: { name: string; amount: string }[];
};

export async function createRecipe(data: CreateRecipeInput) {
    await prisma.recipe.create({
        data: {
            title: data.title,
            difficulty: data.difficulty,
            mealType: data.mealType,
            prepTimeMinutes: data.prepTimeMinutes,
            servings: data.servings,
            steps: data.steps.map((step) => step.value),
            ingredients: {
                create: data.ingredients.map((ingredient) => {
                    const normalizedName = ingredient.name.trim().toLowerCase();
                    return {
                        amount: ingredient.amount,
                        ingredient: {
                            connectOrCreate: {
                                where: { name: normalizedName },
                                create: { name: normalizedName },
                            },
                        },
                    };
                }),
            },
        },
    });

    revalidatePath("/");
    redirect("/");
}

export async function getIngredientNames() {
   return await prisma.ingredient.findMany({
        select: { name: true },
        orderBy: { name: 'asc' },
    })
}

export async function deleteRecipe(id: string) {
    await prisma.recipeIngredient.deleteMany({ where: { recipeId: id } });
    await prisma.recipe.delete({ where: { id } });
    revalidatePath("/");
    redirect("/");
}
