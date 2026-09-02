import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@/components/ui/combobox"

interface IngredientComboboxProps {
  value: string;
  onChange: (value: string) => void;
  items: string[];
};

export function IngredientCombobox({ value, onChange, items }: IngredientComboboxProps) {
    return (
        <Combobox
            items={items}
            inputValue={value}
            onInputValueChange={onChange}
            onValueChange={(selected) => {
                if (typeof selected === "string") onChange(selected);
            }}
        >
            <ComboboxInput placeholder="Wybierz składnik" />
            <ComboboxContent>
                <ComboboxEmpty>Nie znaleziono składników.</ComboboxEmpty>
                <ComboboxList>
                    {(ingredient: string) => (
                        <ComboboxItem key={ingredient} value={ingredient}>
                            {ingredient}
                        </ComboboxItem>
                    )}
                </ComboboxList>
            </ComboboxContent>
        </Combobox>
    )
}
