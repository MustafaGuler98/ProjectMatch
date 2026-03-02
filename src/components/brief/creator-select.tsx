"use client";

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "~/components/ui/select";
import { api } from "~/trpc/react";

interface CreatorSelectProps {
    value: string;
    onValueChange: (value: string) => void;
}

export function CreatorSelect({ value, onValueChange }: CreatorSelectProps) {
    const { data: creators, isLoading } = api.creator.getAll.useQuery();

    return (
        <Select value={value} onValueChange={onValueChange}>
            <SelectTrigger className="w-full bg-white">
                <SelectValue placeholder={isLoading ? "Loading..." : "Select a creator"} />
            </SelectTrigger>
            <SelectContent position="popper" sideOffset={4}>
                {creators?.map((c) => (
                    <SelectItem key={c.id} value={c.id}>
                        @{c.username}
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    );
}
