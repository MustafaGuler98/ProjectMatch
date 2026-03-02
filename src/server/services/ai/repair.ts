
export function repairJson(raw: string): string {
    let text = raw.trim();

    // Strip BOM if present
    if (text.charCodeAt(0) === 0xfeff) {
        text = text.slice(1);
    }

    // Remove markdown fenced code block wrappers (```json ... ``` or ``` ... ```)
    text = text.replace(/^```(?:json)?\s*\n?/i, "").replace(/\n?\s*```$/i, "");

    // Remove trailing commas before } or ]
    text = text.replace(/,\s*([}\]])/g, "$1");

    return text.trim();
}
