import Link from "next/link";
import prisma from "./lib/prisma";
import { MealType } from "./generated/prisma/enums";
import { CategoryNav } from "./components/CategoryNav";

export default async function Home({ searchParams }: { searchParams: Promise<{ mealType?: MealType }> }) {
    const { mealType } = await searchParams;
    const defaultMealType = mealType ?? MealType.dinner;
    
    const recipes = await prisma.recipe.findMany({ 
        where: { mealType: defaultMealType },
        orderBy: { createdAt: "asc" } 
    });


    return (
        <div className="flex flex-col items-center gap-6 text-center sm:items-start sm:text-left">
            <CategoryNav />
            <Link
                href={`/recipes/new?mealType=${defaultMealType}`}
                className="rounded-md bg-black px-4 py-2 text-sm font-medium text-white dark:bg-white dark:text-black"
            >
                Dodaj nowy przepis
            </Link>
            <ol>
                {recipes.map((recipe) =>
                    <li key={recipe.id}>
                        <Link href={`/recipes/${recipe.id}`}>{recipe.title}</Link>
                    </li>
                )}
            </ol>
        </div>
    );
}