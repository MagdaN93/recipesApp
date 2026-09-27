import prisma from "@/app/lib/prisma";
import { Prisma } from "../generated/prisma/client";

export async function findRecipesByIngredients(where: Prisma.RecipeWhereInput, userKeys: string[]) {
    const recipes = await prisma.recipe.findMany({
        where,
        include: { ingredients: {
            where: { ingredient: { isStaple: false } },
            include: { ingredient: true}
        }}
    });

    const rankedRecipes = recipes.map((recipe) => {
        const requiredKeys = recipe.ingredients.map((recipeIngredient) => recipeIngredient.ingredient.baseName ?? recipeIngredient.ingredient.name);
        const includeKeys = requiredKeys.filter((key) => userKeys.includes(key));
        const missing = requiredKeys.length - includeKeys.length;
        
        return { id: recipe.id, title: recipe.title, matched: includeKeys.length, missing };
    });

    return rankedRecipes.filter(r => r.matched > 0).sort((a,b) => b.matched - a.matched || a.missing - b.missing || a.title.localeCompare(b.title));
}