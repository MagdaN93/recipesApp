import Link from "next/link";
import prisma from "./lib/prisma";

export default async function Home() {
    const recipes = await prisma.recipe.findMany();
    return (
        <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black">
            <main className="flex flex-1 w-full max-w-3xl flex-col items-center justify-between py-32 px-16 bg-white dark:bg-black sm:items-start">
                <div className="flex flex-col items-center gap-6 text-center sm:items-start sm:text-left">
                    <h1 className="max-w-xs text-3xl font-semibold leading-10 tracking-tight text-black dark:text-zinc-50">
                        Recipes list:
                    </h1>
                    <Link
                        href="/recipes/new"
                        className="rounded-md bg-black px-4 py-2 text-sm font-medium text-white dark:bg-white dark:text-black"
                    >
                        Add a recipe
                    </Link>
                    <ol>
                        {recipes.map((recipe, index) =>
                            <li key={recipe.id}>
                                <Link href={`/recipes/${recipe.id}`}>{recipe.title}</Link>
                            </li>
                        )}
                    </ol>
                </div>
            </main>
        </div>
    );
}