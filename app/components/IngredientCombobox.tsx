import { useEffect, useState } from "react";

import { getIngredientNames } from "../recipes/actions";
 
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@/components/ui/combobox"
 
export function IngredientCombobox() {
    const [ingredientNames, setIngredientNames] = useState<string[]>([]);
    
    useEffect(() => {
        getIngredientNames().then(data => setIngredientNames(data.map(i => i.name)));
    }, []);

    return (
        <Combobox
        items={ingredientNames}
        >
            <ComboboxInput placeholder="Wybierz składnik" />
            <ComboboxContent>
                <ComboboxEmpty>Nie znaleziono składników.</ComboboxEmpty>
                <ComboboxList>
                    {(ingredient) => (
                        <ComboboxItem key={ingredient} value={ingredient}>
                            {ingredient}
                        </ComboboxItem>
                    )}
                </ComboboxList>
            </ComboboxContent>
        </Combobox>
    )
}