"use client"

import { Autocomplete as AutocompletePrimitive } from "@base-ui/react"

import {
  ComboboxContent as AutocompleteContent,
  ComboboxEmpty as AutocompleteEmpty,
  ComboboxInput as AutocompleteInput,
  ComboboxItem as AutocompleteItem,
  ComboboxList as AutocompleteList,
  ComboboxCollection as AutocompleteCollection,
} from "@/components/ui/combobox"

const Autocomplete = AutocompletePrimitive.Root

export {
  Autocomplete,
  AutocompleteInput,
  AutocompleteContent,
  AutocompleteList,
  AutocompleteItem,
  AutocompleteCollection,
  AutocompleteEmpty,
}
