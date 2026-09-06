import { useFieldArray, useFormContext, useFormState } from "react-hook-form";
import { DndContext, DragEndEvent } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import {
  FieldLabel,
  FieldError,
  FieldSeparator
} from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import { RecipeFormInput } from "./RecipeForm";
import { SortableStepRow } from "./SortableStepRow";

export function StepsField() {
    const { control } = useFormContext<RecipeFormInput>();
    const { errors } = useFormState({ control });
    const { fields: stepFields, append: appendSteps, remove: removeSteps, move: moveSteps } = useFieldArray({
        control,
        name: "steps"
    });

    function handleDragEnd(event: DragEndEvent) {
        const { active, over } = event;
        if (!over || active.id === over.id) return;

        const oldIndex = stepFields.findIndex((field) => field.id === active.id);
        const newIndex = stepFields.findIndex((field) => field.id === over.id);
        if (oldIndex !== -1 && newIndex !== -1) {
            moveSteps(oldIndex, newIndex);
        }
    }

    return (
        <>
            <FieldLabel className="mt-4">Dodaj kroki:</FieldLabel>
            <DndContext id="steps-dnd" onDragEnd={handleDragEnd}>
                <SortableContext items={stepFields.map((f) => f.id)} strategy={verticalListSortingStrategy}>
                    {stepFields.map((step, index) =>
                        <SortableStepRow
                            key={step.id}
                            id={step.id}
                            index={index}
                            remove={removeSteps}
                            append={appendSteps}
                            showRemove={stepFields.length > 1}
                        />
                    )}
                </SortableContext>
            </DndContext>

            <FieldError>{errors.steps?.message}</FieldError>
            <Button type="button" onClick={() => appendSteps({ value: "" })}>Dodaj następny krok</Button>
            <FieldSeparator />
        </>
    )
}
