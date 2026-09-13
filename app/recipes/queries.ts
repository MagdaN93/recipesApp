import prisma from "@/app/lib/prisma";

export async function findRecipesByIngredients(userKeys: string[]) {
    const recipes = await prisma.recipe.findMany({ 
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
    })

    rankedRecipes.sort((a,b) => a.matched - b.matched)
    
    return rankedRecipes;
}