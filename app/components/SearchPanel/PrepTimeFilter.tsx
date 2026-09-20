"use client"

import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Clock, ChevronDown } from "lucide-react";

const popoverItems = [
    {label: "Do 15 minut", value: "15"},
    {label: "Do 30 minut", value: "30"},
    {label: "Do 60 minut", value: "60"}
];

export function PrepTimeFilter() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const maxTime = searchParams.get("maxTime") ?? "";
    const selectedLabel = popoverItems.find(item => item.value === maxTime)?.label;

    const handleCheckChange = (checked:boolean, itemValue:string) => {
        const params = new URLSearchParams(searchParams);
        if (checked) {
            params.set("maxTime", itemValue)
        } else {
            params.delete("maxTime")
        }

        router.replace(`/?${params.toString()}`, { scroll: false })
    }

    return (
        <Popover>
            <PopoverTrigger render={
                <Button variant="outline" className="w-fit">
                    <Clock className="h-4 w-4" />
                    {selectedLabel ?? "Czas przygotowania"}
                    <ChevronDown className="h-4 w-4 opacity-50" />
                </Button>
            }/>
            <PopoverContent className="w-56 p-3" align="start">
                {popoverItems.map(item => (
                    <div key={item.value} className="flex items-center space-x-2 py-1.5">
                        <Checkbox
                            checked={maxTime === item.value}
                            id={item.value}
                            onCheckedChange={checked => handleCheckChange(checked, item.value)}
                        />
                        <Label htmlFor={item.value} className="font-normal">
                            {item.label}
                        </Label>
                    </div>
                ))}
            </PopoverContent>
        </Popover>
    )
}