"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Separator } from "~/components/ui/separator";
import { Button } from "~/components/ui/button";

interface BriefData {
    outreachMessage: string;
    contentIdea1: string;
    contentIdea2: string;
    contentIdea3: string;
    contentIdea4: string;
    contentIdea5: string;
    hookSuggestion1: string;
    hookSuggestion2: string;
    hookSuggestion3: string;
}

interface BriefResultProps {
    data: BriefData;
}

function CopyButton({ text, label }: { text: string; label?: string }) {
    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
        await navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
    };

    return (
        <Button
            variant="ghost"
            size="sm"
            className="h-7 text-xs text-slate-400 hover:text-slate-700"
            onClick={handleCopy}
        >
            {copied ? "Copied!" : label ?? "Copy"}
        </Button>
    );
}

export function BriefResult({ data }: BriefResultProps) {
    const [jsonOpen, setJsonOpen] = useState(false);

    const contentIdeas = [
        data.contentIdea1,
        data.contentIdea2,
        data.contentIdea3,
        data.contentIdea4,
        data.contentIdea5,
    ];

    const hooks = [
        data.hookSuggestion1,
        data.hookSuggestion2,
        data.hookSuggestion3,
    ];

    const jsonString = JSON.stringify(data, null, 2);

    return (
        <div className="space-y-4">
            {/* Collapsible Raw JSON Box */}
            <Card className="bg-white">
                <CardHeader className="pb-0">
                    <div className="flex items-center justify-between">
                        <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 px-0 text-sm font-semibold text-slate-700 hover:text-slate-900 hover:bg-transparent"
                            onClick={() => setJsonOpen(!jsonOpen)}
                        >
                            <span className="mr-2 inline-block transition-transform duration-200"
                                style={{ transform: jsonOpen ? "rotate(90deg)" : "rotate(0deg)" }}
                            >
                                ▶
                            </span>
                            Raw JSON
                        </Button>
                        {jsonOpen && <CopyButton text={jsonString} label="Copy JSON" />}
                    </div>
                </CardHeader>
                {jsonOpen && (
                    <>
                        <Separator className="mt-2" />
                        <CardContent className="pt-3">
                            <pre className="overflow-x-auto rounded-lg bg-slate-50 p-4 text-xs leading-relaxed text-slate-700 border border-slate-200">
                                <code>{jsonString}</code>
                            </pre>
                        </CardContent>
                    </>
                )}
            </Card>

            {/* Outreach Message */}
            <Card className="bg-white">
                <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                        <CardTitle className="text-sm">Outreach Message</CardTitle>
                        <CopyButton text={data.outreachMessage} />
                    </div>
                </CardHeader>
                <CardContent>
                    <p className="text-sm leading-relaxed text-slate-700 whitespace-pre-wrap">
                        {data.outreachMessage}
                    </p>
                </CardContent>
            </Card>

            {/* Content Ideas */}
            <Card className="bg-white">
                <CardHeader className="pb-2">
                    <CardTitle className="text-sm">Content Ideas</CardTitle>
                </CardHeader>
                <Separator />
                <CardContent className="pt-3">
                    <ol className="space-y-3">
                        {contentIdeas.map((idea, i) => (
                            <li key={i} className="flex gap-3 text-sm">
                                <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-slate-100 text-xs font-bold text-slate-500">
                                    {i + 1}
                                </span>
                                <span className="text-slate-700 leading-relaxed">{idea}</span>
                            </li>
                        ))}
                    </ol>
                </CardContent>
            </Card>

            {/* Hook Suggestions */}
            <Card className="bg-white">
                <CardHeader className="pb-2">
                    <CardTitle className="text-sm">Hook Suggestions</CardTitle>
                </CardHeader>
                <Separator />
                <CardContent className="pt-3">
                    <ol className="space-y-3">
                        {hooks.map((hook, i) => (
                            <li key={i} className="flex gap-3 text-sm">
                                <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-slate-100 text-xs font-bold text-slate-500">
                                    {i + 1}
                                </span>
                                <span className="text-slate-700 leading-relaxed">{hook}</span>
                            </li>
                        ))}
                    </ol>
                </CardContent>
            </Card>
        </div>
    );
}
