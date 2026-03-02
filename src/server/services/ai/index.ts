import { GoogleGenAI } from "@google/genai";
import { zodToJsonSchema } from "zod-to-json-schema";
import type { Campaign, Creator } from "@prisma/client";

import { env } from "~/env";
import { GEMINI_MODEL, MAX_RETRY_COUNT } from "~/shared/constants";
import { AI_EMPTY_RESPONSE, AI_MALFORMED_JSON } from "~/shared/messages";
import { aiBriefSchema, type AiBrief } from "./schemas";
import { buildBriefPrompt } from "./prompt";
import { repairJson } from "./repair";

const ai = new GoogleGenAI({ apiKey: env.GEMINI_API_KEY });

export async function generateBrief(
    campaign: Campaign,
    creator: Creator,
): Promise<AiBrief> {
    const prompt = buildBriefPrompt(campaign, creator);
    const jsonSchema = zodToJsonSchema(aiBriefSchema);

    let lastError: Error | null = null;

    for (let attempt = 0; attempt <= MAX_RETRY_COUNT; attempt++) {
        const contents =
            attempt === 0
                ? prompt
                : `${prompt}\n\nYour previous response was invalid: ${lastError?.message}. Please fix and try again.`;

        const response = await ai.models.generateContent({
            model: GEMINI_MODEL,
            contents,
            config: {
                responseMimeType: "application/json",
                responseJsonSchema: jsonSchema,
            },
        });

        const text = response.text;
        if (!text) {
            lastError = new Error(AI_EMPTY_RESPONSE);
            continue;
        }

        // Sanitize common AI JSON issues 
        const repaired = repairJson(text);

        // Safe parse
        let parsed: unknown;
        try {
            parsed = JSON.parse(repaired);
        } catch (err) {
            const detail = err instanceof Error ? err.message : String(err);
            lastError = new Error(AI_MALFORMED_JSON(detail));
            continue;
        }

        // Schema validation via Zod
        const parseResult = aiBriefSchema.safeParse(parsed);

        if (parseResult.success) {
            return parseResult.data;
        }

        lastError = new Error(parseResult.error.message);
    }

    throw lastError ?? new Error("AI brief generation failed.");
}

