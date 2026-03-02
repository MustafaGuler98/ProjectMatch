"use client";

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "~/components/ui/select";
import { api } from "~/trpc/react";

interface CampaignSelectProps {
    value: string;
    onValueChange: (value: string) => void;
}

export function CampaignSelect({ value, onValueChange }: CampaignSelectProps) {
    const { data: campaigns, isLoading } = api.campaign.getAll.useQuery();

    return (
        <Select value={value} onValueChange={onValueChange}>
            <SelectTrigger className="w-72 bg-white">
                <SelectValue placeholder="Select a campaign" />
            </SelectTrigger>
            <SelectContent position="popper" sideOffset={4}>
                {campaigns?.map((c) => (
                    <SelectItem key={c.id} value={c.id}>
                        {c.brand} — {c.objective}
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    );
}
