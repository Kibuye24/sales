import { GoogleGenerativeAI } from "@google/generative-ai";
import {
  LEAD_GENERATION_SYSTEM_PROMPT,
  buildSearchPrompt,
} from "./gemini-prompt";

// Lazy-initialize the Gemini client
let _genAI: GoogleGenerativeAI | null = null;

function getGenAI(): GoogleGenerativeAI {
  if (!_genAI) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error(
        "GEMINI_API_KEY is not configured. Add it to .env.local"
      );
    }
    _genAI = new GoogleGenerativeAI(apiKey);
  }
  return _genAI;
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
 * Runs the lead-generation agent using Google Gemini 1.5 Flash.
 */
export async function runLeadAgent(
  params: AgentSearchParams
): Promise<AgentSearchResult> {
  const genAI = getGenAI();
  const model = genAI.getGenerativeModel({ 
    model: "gemini-3.1-flash-lite-preview",
    generationConfig: { responseMimeType: "application/json" }
  });

  const userPrompt = buildSearchPrompt(params.area, params.category);

  // Gemini handles system instruction via a separate field in some versions, 
  // but standard chat structure works well for basic extraction.
  const result = await model.generateContent([
    LEAD_GENERATION_SYSTEM_PROMPT,
    userPrompt
  ]);

  const response = await result.response;
  const text = response.text();

  // Parse JSON from response
  let parsed: Record<string, unknown>;
  try {
    parsed = JSON.parse(text);
  } catch (err) {
    console.error("JSON Parse Error:", text);
    throw new Error("Failed to parse Gemini response as JSON");
  }

  const leads = (parsed.leads || []) as Record<string, unknown>[];
  const metadata = (parsed.metadata || {}) as Record<string, unknown>;

  return {
    leads,
    metadata: {
      area_searched: params.area,
      category_searched: params.category,
      total_found: leads.length,
      search_notes: (metadata.search_notes as string) || "Market intelligence generated via Gemini 1.5 Flash",
      data_quality_note:
        (metadata.data_quality_note as string) ||
        "Business intelligence retrieved via Google Gemini. Always verify contact details before outreach.",
    },
  };
}
