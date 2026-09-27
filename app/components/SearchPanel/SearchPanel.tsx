import { PrepTimeFilter } from "./PrepTimeFilter";
import { SearchByName } from "./SearchByName";
import { SearchByIngredients } from "./SearchByIngredients";
import { getIngredientGroups } from "@/app/recipes/actions";

export async function SearchPanel() {
    const ingredientGroups = await getIngredientGroups();

    return (
        <div className="flex justify-between items-center gap-4">
            <PrepTimeFilter />
            <SearchByName /> 
            <SearchByIngredients ingredientGroups={ingredientGroups}/>
        </div>
    )
}