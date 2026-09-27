"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Combobox, ComboboxEmpty, useComboboxAnchor, ComboboxChips, ComboboxChip, ComboboxChipsInput, ComboboxContent, ComboboxList, ComboboxItem } from "@/components/ui/combobox";

export function SearchByIngredients({ingredientGroups}: {ingredientGroups:string[]}) {
    const searchParams = useSearchParams();
    const router = useRouter();
    const selectedIngredients = searchParams.get("ingredients")?.split(",").filter(Boolean) ?? [];

    const anchor = useComboboxAnchor();

    const handleIngredientsChange = (value:string[]) => {
        const params = new URLSearchParams(searchParams);
        if (value.length) {
            params.set("ingredients", value.join(","));
        } else {
            params.delete("ingredients");
        }

        router.replace(`/?${params.toString()}`, { scroll: false });
    }

    return (
        <Combobox 
            items={ingredientGroups}
            value={selectedIngredients}
            onValueChange={handleIngredientsChange}
            multiple
        >
            <ComboboxChips ref={anchor}>
                {selectedIngredients.map((item) => (
                    <ComboboxChip key={item}>{item}</ComboboxChip>
                ))}
                <ComboboxChipsInput placeholder={selectedIngredients.length ? "" : "Wyszukaj składniki"} />
            </ComboboxChips>
            <ComboboxContent anchor={anchor}>
                <ComboboxEmpty>Brak szukanego składnika.</ComboboxEmpty>
                <ComboboxList>
                {(item) => (
                    <ComboboxItem key={item} value={item}>
                    {item}
                    </ComboboxItem>
                )}
                </ComboboxList>
            </ComboboxContent>
        </Combobox>
    )
}