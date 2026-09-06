import { useFormContext } from "react-hook-form";
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RecipeFormInput } from "./RecipeForm";

export function SortableStepRow({
    id,
    index,
    remove,
    append,
    showRemove,
}: {
    id: string;
    index: number;
    remove: (index: number) => void;
    append: (value: { value: string }) => void;
    showRemove: boolean;
}) {
    const { register } = useFormContext<RecipeFormInput>();
    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    return (
        <div ref={setNodeRef} style={style} className="flex items-center gap-2">
            <button type="button" {...attributes} {...listeners} className="cursor-grab touch-none">
                <GripVertical className="size-4 text-muted-foreground" />
            </button>
            <Input
                type="text"
                placeholder={`Krok ${index + 1}`}
                {...register(`steps.${index}.value`)}
                onKeyDown={(e) => {
                    if (e.key === "Enter") {
                        e.preventDefault();
                        append({ value: "" });
                    }
                }}
            />
            {showRemove && (
                <Button
                    type="button"
                    variant="destructive"
                    size="icon-sm"
                    aria-label="Usuń krok"
                    onClick={() => remove(index)}
                >
                    <X />
                </Button>
            )}
        </div>
    );
}