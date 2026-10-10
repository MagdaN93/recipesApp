"use client"

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { MealType } from "@/app/generated/prisma/enums";

const tabs = [
    { label: "Obiady", value: MealType.dinner },
    { label: "Desery", value: MealType.dessert },
    { label: "Kolacje", value: MealType.supper },
    { label: "Przekąski", value: MealType.snack },
];

export function CategoryNav() {
    const searchParams = useSearchParams();
    const activeMealType = searchParams.get("mealType") ?? MealType.dinner;

    return (
        <nav className="flex w-full gap-6 border-b border-border">
            {tabs.map((tab) => (
                <Link
                    key={tab.value}
                    href={`/?mealType=${tab.value}`}
                    className={
                        activeMealType === tab.value
                            ? "border-b-2 pb-2 font-semibold border-primary text-foreground"
                            : "border-b-2 border-transparent pb-2 font-medium text-muted-foreground hover:text-foreground"
                    }
                >
                    {tab.label}
                </Link>
            ))}
        </nav>
    );
}
