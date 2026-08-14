export interface Ingredient {
    name: string;
    amount: string;
}

export interface Recipe {
    id: string;
    ingredients: Ingredient[];
    title: string;
    steps: string[];
    difficulty: "easy" | "medium" | "hard";
    prepTimeMinutes: number;
    mealType: "breakfast" | "dinner" | "dessert" | "supper";
    servings: number;
}