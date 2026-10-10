
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import prisma from "../../../lib/prisma";
import { RecipeForm } from "@/app/components/RecipeForm";
import { updateRecipe } from "../../actions";

export default async function EditRecipePage({params}: {params: Promise<{ id: string }>}) {
    const session = await auth();
    if (session?.user.role !== 'admin') redirect('/');

    const { id } = await params;
    const recipe = await prisma.recipe.findUnique({
        where: { id },
        include: { ingredients: { include: { ingredient: true } } },
    });

    if (!recipe) return <p>Nie znaleziono przepisu</p>

     const defaultValues = {
        title: recipe.title,
        prepTimeMinutes: recipe.prepTimeMinutes,
        servings: recipe.servings,
        mealType: recipe.mealType,
        difficulty: recipe.difficulty,
        steps: recipe.steps.map(value => ({ value })),
        ingredients: recipe.ingredients.map(ri => ({ name: ri.ingredient.name, amount: ri.amount })),
    };

    return (
        <>
            <h1 className="text-center">{`Edytuj: ${defaultValues.title}`}</h1>
            <RecipeForm defaultValues={defaultValues} onSubmit={updateRecipe.bind(null, id)} cancelHref={`/recipes/${id}`}/>
        </>
    )
}