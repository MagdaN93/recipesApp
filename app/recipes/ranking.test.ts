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
        const result = rankRecipes(recipes,  ["marchew", "pietruszka", "kurczak"]);

        expect(result.map((r) => r.title)).toEqual(["Rosół", "Sałatka"]);
    });

    it("ranks the recipe with fewer missing ingredients first when matches are equal", () => {
        const recipes = [recipe("Rosół", "kurczak", "marchew", "pietruszka"), recipe("Sałatka", "marchew", "pietruszka")];
        const result = rankRecipes(recipes,  ["marchew", "pietruszka"]);

        expect(result.map((r) => r.title)).toEqual(["Sałatka", "Rosół"]);
    });

    it("sorts recipes alphabetically by title when matches and missing are equal", () => {
        const recipes = [recipe("Rosół", "kurczak", "marchew", "pietruszka"), recipe("Barszcz", "kurczak", "marchew", "pietruszka")];
        const result = rankRecipes(recipes,  ["marchew", "pietruszka"]);

        expect(result.map((r) => r.title)).toEqual(["Barszcz", "Rosół"]);
    });

    it("counts each ingredient line separately, even within the same family", () => {
        const recipes: RecipeInput[] = [{
            id: "Kurczak dwa sposoby",
            title: "Kurczak dwa sposoby",
            ingredients: [
                { ingredient: { name: "pierś z kurczaka", baseName: "kurczak" } },
                { ingredient: { name: "udka z kurczaka", baseName: "kurczak" } },
            ],
        }];
        const result = rankRecipes(recipes, ["kurczak"]);

        expect(result).toEqual([{ id: "Kurczak dwa sposoby", title: "Kurczak dwa sposoby", matched: 2, missing: 0 }]);
    });

    it("matches an ingredient by its family name", () => {
        const recipes: RecipeInput[] = [{
            id: "Kurczak",
            title: "Kurczak",
            ingredients: [{ ingredient: { name: "pierś z kurczaka", baseName: "kurczak" } }],
        }];
        const result = rankRecipes(recipes, ["kurczak"]);

        expect(result).toEqual([{ id: "Kurczak", title: "Kurczak", matched: 1, missing: 0 }]);
    });

    it("does not match an ingredient by its full name when it belongs to a family", () => {
        const recipes: RecipeInput[] = [{
            id: "Kurczak",
            title: "Kurczak",
            ingredients: [{ ingredient: { name: "pierś z kurczaka", baseName: "kurczak" } }],
        }];
        const result = rankRecipes(recipes, ["pierś z kurczaka"]);

        expect(result).toEqual([]);
    });

    it("falls back to the ingredient name when it has no family name", () => {
        const recipes = [recipe("Sałatka", "ogórek")];
        const result = rankRecipes(recipes, ["ogórek"]);

        expect(result).toEqual([{ id: "Sałatka", title: "Sałatka", matched: 1, missing: 0 }]);
    });

    it("returns no recipes when the user selected nothing", () => {
        const recipes = [recipe("Rosół", "kurczak", "marchew")];
        const result = rankRecipes(recipes, []);

        expect(result).toEqual([]);
    });

    it("excludes recipes that have no ingredients", () => {
        const recipes = [recipe("Pusty")];
        const result = rankRecipes(recipes, ["kurczak"]);

        expect(result).toEqual([]);
    });
});
