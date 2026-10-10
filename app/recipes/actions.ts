"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import prisma from "@/app/lib/prisma";
import { Difficulty, MealType } from "@/app/generated/prisma/enums";
import { requireAdmin } from "../auth/requireAdmin";

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
    await requireAdmin();
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
    redirect(`/?mealType=${data.mealType}`);
}

export async function getIngredientNames() {
    return await prisma.ingredient.findMany({
        select: { name: true },
        orderBy: { name: 'asc' },
    });
}

export async function getIngredientGroups() {
    const ingredients = await prisma.ingredient.findMany({
        where: { isStaple: false },
        select: {name: true, baseName: true },
    })
    const keys = new Set(ingredients.map(i => i.baseName ?? i.name));
    return Array.from(keys).sort((a,b) => a.localeCompare(b));
}

export async function deleteRecipe(id: string, mealType: MealType) {
    await requireAdmin();
    await prisma.recipeIngredient.deleteMany({ where: { recipeId: id } });
    await prisma.recipe.delete({ where: { id } });
    revalidatePath("/");
    redirect(`/?mealType=${mealType}`);
}

export async function updateRecipe(id: string, data: CreateRecipeInput) {
    await requireAdmin();
    await prisma.recipe.update({
        where: { id },
        data: {
            title: data.title,
            difficulty: data.difficulty,
            mealType: data.mealType,
            prepTimeMinutes: data.prepTimeMinutes,
            servings: data.servings,
            steps: data.steps.map((step) => step.value),
            ingredients: {
                deleteMany: {},
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
    revalidatePath(`/recipes/${id}`);
    redirect(`/recipes/${id}`);
}