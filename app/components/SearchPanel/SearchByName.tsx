"use client"

import { ChangeEvent } from "react";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search } from "lucide-react";
import { InputGroup, InputGroupInput, InputGroupAddon } from "@/components/ui/input-group";
import { debounce } from "@/app/tools/debounce";

export function SearchByName() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const name = searchParams.get("name") ?? "";
    const [value, setValue] = useState(name);


    const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
        const nextValue = e.target.value;
        setValue(nextValue);

        const params = new URLSearchParams(searchParams);
        if (!!value) {
            params.set("name", value)
        } else {
            params.delete("name")
        }

        debounce( () => {router.replace(`/?${params.toString()}`, { scroll: false })});
    }
    

    return (
        <InputGroup className="max-w-xs">
            <InputGroupInput
                placeholder="Szukaj przepisu..."
                value={value}
                onChange={handleSearchChange}
            />
            <InputGroupAddon>
                <Search />
            </InputGroupAddon>
        </InputGroup>
    )
}