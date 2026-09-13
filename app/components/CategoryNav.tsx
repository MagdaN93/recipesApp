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
        <nav className="flex w-full gap-6 border-b border-zinc-200 dark:border-zinc-800">
            {tabs.map((tab) => (
                <Link
                    key={tab.value}
                    href={`/?mealType=${tab.value}`}
                    className={
                        activeMealType === tab.value
                            ? "border-b-2 border-black pb-2 font-semibold text-black dark:border-white dark:text-white"
                            : "border-b-2 border-transparent pb-2 font-medium text-zinc-500 hover:text-black dark:text-zinc-400 dark:hover:text-white"
                    }
                >
                    {tab.label}
                </Link>
            ))}
        </nav>
    );
}
