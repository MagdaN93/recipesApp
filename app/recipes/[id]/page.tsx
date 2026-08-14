import { recipes } from "@/app/data/recipes";

export default async function RecipePage({params}: {
    params: Promise<{ id: string }>
}) {
    const { id } = await params;

    const recipe = recipes.find((recipe) => recipe.id === id);

    if (!recipe) return <p>Nie znaleziono przepisu</p>
    
    return (
        <div>
            <h1>{recipe.title}</h1>
            <span>Trudność: {recipe.difficulty}. Czas: {recipe.prepTimeMinutes} min. Liczba porcji: {recipe.servings}</span>
            <br/>
            <br/>
            <h4>Składniki:</h4>
            <ul>
                {recipe.ingredients.map((ingredient, index) =>
                    <li key={index}>
                        {ingredient.name} {ingredient.amount}
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