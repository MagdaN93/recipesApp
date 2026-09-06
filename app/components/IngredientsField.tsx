import { useEffect, useState } from "react";
import { useFormContext, useFormState, useFieldArray, Controller } from "react-hook-form";
import {
  FieldLabel,
  FieldError,
  FieldSeparator
} from "@/components/ui/field"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { X } from "lucide-react"
import { getIngredientNames } from "../recipes/actions";
import { IngredientCombobox } from "@/app/components/IngredientCombobox";
import { RecipeFormInput } from "./RecipeForm";

export function IngredientsField() {
    const { control, register } = useFormContext<RecipeFormInput>();

    const { fields, append, remove } = useFieldArray({
        control,
        name: "ingredients"
    });
    const { errors } = useFormState({ control });

    const [ingredientNames, setIngredientNames] = useState<string[]>([]);

    useEffect(() => {
        getIngredientNames().then((data) => setIngredientNames(data.map((i) => i.name)));
    }, []);

    return (
        <>
            <FieldLabel className="mt-4">Dodaj składniki:</FieldLabel>
            {fields.map((ingredient, index) => 
                <div key={ingredient.id} className="flex items-center gap-2">
                    <Controller
                        control={control}
                        name={`ingredients.${index}.name`}
                        render={({ field }) => (
                            <IngredientCombobox
                                value={field.value}
                                onChange={field.onChange}
                                items={ingredientNames}
                            />
                        )}
                    />
                    
                    <Input
                        type="text"
                        placeholder="Ilość"
                        className="flex-1"
                        {...register(`ingredients.${index}.amount`)}
                        onKeyDown={(e) => {
                            if (e.key === "Enter") {
                                e.preventDefault();
                                append({ name: "", amount: "" });
                            }
                        }}
                    />
                    <FieldError>{errors.ingredients?.[index]?.name?.message}</FieldError>
                    <FieldError>{errors.ingredients?.[index]?.amount?.message}</FieldError>
                    {fields.length > 1 && (
                        <Button
                            type="button"
                            variant="destructive"
                            size="icon-sm"
                            aria-label="Usuń składnik"
                            onClick={() => remove(index)}
                        >
                            <X />
                        </Button>
                    )}
                </div>
            )}
            <FieldError>{errors.ingredients?.message}</FieldError>
            <Button type="button" onClick={() => append({ name: "", amount: "" })}>Dodaj następny składnik</Button>
            <FieldSeparator />
        </>
    )
}