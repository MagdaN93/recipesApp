export type RecipeInput = {
    id: string;
    title: string;
    ingredients: { ingredient: { name: string; baseName: string | null } }[];
};

export function rankRecipes(recipes: RecipeInput[], userKeys: string[]) {
    const rankedRecipes = recipes.map((recipe) => {
        const requiredKeys = recipe.ingredients.map((recipeIngredient) => recipeIngredient.ingredient.baseName ?? recipeIngredient.ingredient.name);
        const includeKeys = requiredKeys.filter((key) => userKeys.includes(key));
        const missing = requiredKeys.length - includeKeys.length;
        
        return { id: recipe.id, title: recipe.title, matched: includeKeys.length, missing };
    });

    return rankedRecipes.filter(r => r.matched > 0).sort((a,b) => a.missing - b.missing || b.matched - a.matched || a.title.localeCompare(b.title));
}