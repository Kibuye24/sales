import Groq from "groq-sdk";
import {
  LEAD_GENERATION_SYSTEM_PROMPT,
  buildSearchPrompt,
} from "./gemini-prompt";

// Lazy-initialize the Groq client
let _groq: Groq | null = null;

function getGroqClient(): Groq {
  if (!_groq) {
    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      throw new Error(
        "GROQ_API_KEY is not configured. Add it to .env.local"
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
    data_quality_note?: string;
  };
}

/**
 * Runs the lead-generation agent using Groq (Llama 3.3 70B).
 *
 * The prompt is designed to maximize accuracy by:
 * - Only asking for business names the model is confident about
 * - Requiring null for unverified contact details
 * - Adding confidence levels and verification flags
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
    temperature: 0.3, // Low temp = more factual, less creative
    top_p: 0.85,
    max_tokens: 8192,
    response_format: { type: "json_object" },
  });

  const text = response.choices[0]?.message?.content ?? "";

  // Parse JSON from response
  let parsed: Record<string, unknown>;
  try {
    parsed = JSON.parse(text);
  } catch {
    const jsonMatch = text.match(/```(?:json)?\s*([\s\S]*?)```/);
    if (jsonMatch) {
      parsed = JSON.parse(jsonMatch[1].trim());
    } else {
      throw new Error("Failed to parse Groq response as JSON");
    }
  }

  const leads = (parsed.leads || []) as Record<string, unknown>[];
  const metadata = (parsed.metadata || {}) as Record<string, unknown>;

  return {
    leads,
    metadata: {
      area_searched: params.area,
      category_searched: params.category,
      total_found: leads.length,
      search_notes: (metadata.search_notes as string) || "AI-generated lead list",
      data_quality_note:
        (metadata.data_quality_note as string) ||
        "Business names are high-confidence. Contact details should be verified via Google Maps or direct visits.",
    },
  };
}
