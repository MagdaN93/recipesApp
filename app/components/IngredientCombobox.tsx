import {
  Autocomplete,
  AutocompleteContent,
  AutocompleteEmpty,
  AutocompleteInput,
  AutocompleteItem,
  AutocompleteList,
} from "@/components/ui/autocomplete"

interface IngredientComboboxProps {
  value: string;
  onChange: (value: string) => void;
  items: string[];
}

export function IngredientCombobox({ value, onChange, items }: IngredientComboboxProps) {
    return (
        <Autocomplete
            items={items}
            value={value}
            onValueChange={onChange}
        >
            <AutocompleteInput placeholder="Wybierz składnik" className="flex-1" />
            <AutocompleteContent>
                <AutocompleteEmpty>Nie znaleziono składników.</AutocompleteEmpty>
                <AutocompleteList>
                    {(ingredient: string) => (
                        <AutocompleteItem key={ingredient} value={ingredient}>
                            {ingredient}
                        </AutocompleteItem>
                    )}
                </AutocompleteList>
            </AutocompleteContent>
        </Autocomplete>
    )
}
