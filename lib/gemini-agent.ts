import Groq from "groq-sdk";
import {
  LEAD_GENERATION_SYSTEM_PROMPT,
  buildSearchPrompt,
} from "./gemini-prompt";

// Lazy-initialize the Groq client to avoid module-level crashes
// when the API key isn't set yet
let _groq: Groq | null = null;

function getGroqClient(): Groq {
  if (!_groq) {
    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      throw new Error(
        "GROQ_API_KEY is not configured. Add it to .env.local in the glovo-sales-agent directory."
      );
    }
    _groq = new Groq({ apiKey });
  }
  return _groq;
}

export interface AgentSearchParams {
  area: string;
  category: string;
}

export interface AgentSearchResult {
  leads: Record<string, unknown>[];
  metadata: {
    area_searched: string;
    category_searched: string;
    total_found: number;
    search_notes: string;
  };
}

/**
 * Runs the Groq lead-generation agent for a given area + category.
 * Uses llama-3.3-70b-versatile for fast, high-quality structured output.
 */
export async function runLeadAgent(
  params: AgentSearchParams
): Promise<AgentSearchResult> {
  const groq = getGroqClient();
  const userPrompt = buildSearchPrompt(params.area, params.category);

  const response = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [
      { role: "system", content: LEAD_GENERATION_SYSTEM_PROMPT },
      { role: "user", content: userPrompt },
    ],
    temperature: 0.4,
    top_p: 0.9,
    max_tokens: 8192,
    response_format: { type: "json_object" },
  });

  const text = response.choices[0]?.message?.content ?? "";

  // Parse JSON from response
  let parsed: AgentSearchResult;
  try {
    parsed = JSON.parse(text);
  } catch {
    // Try extracting JSON from markdown code block
    const jsonMatch = text.match(/```(?:json)?\s*([\s\S]*?)```/);
    if (jsonMatch) {
      parsed = JSON.parse(jsonMatch[1].trim());
    } else {
      throw new Error("Failed to parse Groq response as JSON");
    }
  }

  return parsed;
}
