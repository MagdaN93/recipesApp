import { Button } from "@/components/ui/button";
import { Combobox, ComboboxChips, ComboboxChip, ComboboxChipsInput, ComboboxContent, ComboboxList, ComboboxItem } from "@/components/ui/combobox";
import { PrepTimeFilter } from "./PrepTimeFilter";
import { SearchByName } from "./SearchByName";

export function SearchPanel() {
    return (
        <div className="flex justify-between items-center gap-4">
            <PrepTimeFilter />
            <SearchByName /> 
        </div>
    )
}