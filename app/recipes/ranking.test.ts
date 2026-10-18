import { describe, expect, it } from "vitest";
import { rankRecipes, RecipeInput } from "./ranking";

const recipe = (title: string, ...ingredients: string[]): RecipeInput => ({
    id: title,
    title,
    ingredients: ingredients.map((name) => ({ ingredient: { name, baseName: null } })),
});

describe("rankRecipes", () => {
    it("counts matched and missing ingredients", () => {
        const recipes = [recipe("Rosół", "kurczak", "marchew", "pietruszka")];
        const result = rankRecipes(recipes, ["kurczak"]);

        expect(result).toEqual([{ id: "Rosół", title: "Rosół", matched: 1, missing: 2 }]);
    });
    it("excludes recipes with no matching ingredients", () => {
        const recipes = [recipe("Sałatka", "ogórek")];
        const result = rankRecipes(recipes, ["kurczak"]);

        expect(result).toEqual([]);
    });
    
    it("ranks the recipe with more matches first, regardless of its size", () => {
        const recipes = [recipe("Rosół", "kurczak", "marchew", "pietruszka", "seler", "por", "ziele angielskie"), recipe("Sałatka", "marchew", "pietruszka")];
        const userKeys = ["marchew", "pietruszka", "kurczak"];

        const result = rankRecipes(recipes, userKeys);

        expect(result.map((r) => r.title)).toEqual(["Sałatka", "Rosół"]);
    });
});
