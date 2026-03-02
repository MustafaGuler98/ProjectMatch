import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";
import { Separator } from "~/components/ui/separator";

interface CampaignInfoProps {
    campaign: {
        id: string;
        brand: string;
        objective: string;
        targetCountry: string;
        targetGender: string;
        targetAgeRange: string;
        niches: string[];
        preferredHookTypes: string[];
        minFollowers: number;
        maxFollowers: number;
        tone: string;
        doNotUseWords: string[];
    };
}

export function CampaignInfo({ campaign }: CampaignInfoProps) {
    return (
        <Card className="bg-white">
            <CardHeader className="pb-3">
                <CardTitle className="text-base">{campaign.brand}</CardTitle>
                <p className="text-sm text-slate-500">{campaign.objective}</p>
            </CardHeader>
            <Separator />
            <CardContent className="grid grid-cols-2 gap-x-8 gap-y-4 pt-4 text-sm">
                {/* Left Column */}
                <div className="space-y-4">
                    <div>
                        <p className="text-xs font-medium text-slate-400">Target Country</p>
                        <p className="text-slate-700">{campaign.targetCountry}</p>
                    </div>
                    <div>
                        <p className="text-xs font-medium text-slate-400">Age Range</p>
                        <p className="text-slate-700">{campaign.targetAgeRange}</p>
                    </div>
                    <div>
                        <p className="text-xs font-medium text-slate-400">Follower Range</p>
                        <p className="text-slate-700">
                            {campaign.minFollowers.toLocaleString()} – {campaign.maxFollowers.toLocaleString()}
                        </p>
                    </div>
                    <div>
                        <p className="text-xs font-medium text-slate-400 mb-1">Niches</p>
                        <div className="flex flex-wrap gap-1">
                            {campaign.niches.map((n) => (
                                <Badge key={n} variant="secondary">{n}</Badge>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right Column */}
                <div className="space-y-4">
                    <div>
                        <p className="text-xs font-medium text-slate-400">Target Gender</p>
                        <p className="text-slate-700">{campaign.targetGender}</p>
                    </div>
                    <div>
                        <p className="text-xs font-medium text-slate-400">Tone</p>
                        <p className="text-slate-700">{campaign.tone}</p>
                    </div>
                    <div>
                        <p className="text-xs font-medium text-slate-400 mb-1">Preferred Hook Types</p>
                        <div className="flex flex-wrap gap-1">
                            {campaign.preferredHookTypes.map((h) => (
                                <Badge key={h} variant="outline" className="text-slate-600">{h}</Badge>
                            ))}
                        </div>
                    </div>
                    {campaign.doNotUseWords && campaign.doNotUseWords.length > 0 && (
                        <div>
                            <p className="text-xs font-medium text-slate-400 mb-1">Do Not Use Words</p>
                            <div className="flex flex-wrap gap-1">
                                {campaign.doNotUseWords.map((w) => (
                                    <Badge key={w} variant="destructive" className="bg-red-50 text-red-600 border-red-200 hover:bg-red-100">{w}</Badge>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
