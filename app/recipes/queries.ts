import prisma from "@/app/lib/prisma";
import { Prisma } from "../generated/prisma/client";
import { rankRecipes } from "./ranking";

export async function findRecipesByIngredients(where: Prisma.RecipeWhereInput, userKeys: string[]) {
    const recipes = await prisma.recipe.findMany({
        where,
        include: { ingredients: {
            where: { ingredient: { isStaple: false } },
            include: { ingredient: true}
        }}
    });
    return rankRecipes(recipes, userKeys);
}