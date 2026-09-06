import Link from "next/link";
import { Button } from "@/components/ui/button";
import prisma from "../../lib/prisma";
import { deleteRecipe } from "../actions";

export default async function RecipePage({params}: {
    params: Promise<{ id: string }>
}) {
    const { id } = await params;

    const recipe = await prisma.recipe.findUnique({
        where: { id },
        include: { ingredients: { include: { ingredient: true } } },
    });

    if (!recipe) return <p>Nie znaleziono przepisu</p>
    
    return (
        <div>
            <h1>{recipe.title}</h1>
            <div className="flex items-center gap-2 my-10">
                <Button render={<Link href={`/recipes/${recipe.id}/edit`} />} nativeButton={false}>Edytuj</Button>
                <form action={deleteRecipe.bind(null, recipe.id, recipe.mealType)}>
                    <Button type="submit" variant="destructive">Usuń przepis</Button>
                </form>
            </div>
            <span>Trudność: {recipe.difficulty}. Czas: {recipe.prepTimeMinutes} min. Liczba porcji: {recipe.servings}</span>
            <br/>
            <br/>
            <h4>Składniki:</h4>
            <ul>
                {recipe.ingredients.map((recipeIngredient, index) =>
                    <li key={index}>
                        {recipeIngredient.ingredient.name} {recipeIngredient.amount}
                    </li>
                )}
            </ul>
            <br/>
            <br/>
            <h4>Przygotowanie:</h4>
            <ol >
                {recipe.steps.map((step, index) =>
                    <li key={index}>
                        {step}
                    </li>
                )}
            </ol>
        </div>
    )
}