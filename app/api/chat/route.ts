import { NextRequest, NextResponse } from "next/server";
import Groq from "groq-sdk";

let _groq: Groq | null = null;

function getGroqClient(): Groq {
  if (!_groq) {
    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      throw new Error("GROQ_API_KEY is not configured");
    }
    _groq = new Groq({ apiKey });
  }
  return _groq;
}

const CHAT_SYSTEM_PROMPT = `You are a Glovo Sales Assistant for the Nairobi, Kenya market.

## YOUR ROLE
You help Glovo's sales team with:
- Answering questions about potential leads and businesses in Nairobi
- Providing sales strategy advice for the food delivery market in Kenya
- Suggesting outreach approaches for different business types
- Sharing knowledge about Nairobi neighbourhoods and their commercial potential
- Helping draft outreach messages, emails, and pitch talking points
- Analyzing the competitive landscape (Uber Eats, Bolt Food, Jumia Food in Kenya)

## CONTEXT
- Glovo is a multi-category delivery platform (food, groceries, pharmacy, etc.)
- Target market: Nairobi, Kenya
- Key areas: Westlands, CBD, Karen, Kilimani, Lavington, Kileleshwa, Hurlingham, Parklands, South B/C, Garden City
- Target businesses: restaurants, cafés, pharmacies, groceries, bakeries, fast food, bars, butcheries, supermarkets
- Competitors in Kenya: Uber Eats, Bolt Food, Jumia Food, Glovo

## GUIDELINES
- Be concise and actionable
- When discussing specific businesses, note if you're uncertain about details
- Provide practical sales tips relevant to the Kenyan market
- If asked to draft messages, make them professional but warm — appropriate for the Kenyan business culture
- Use data points when available but flag estimates vs confirmed facts`;

interface ChatMessage {
  role: "user" | "assistant" | "system";
  content: string;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { messages } = body as { messages: ChatMessage[] };

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json(
        { error: "messages array is required" },
        { status: 400 }
      );
    }

    const groq = getGroqClient();

    const response = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        { role: "system", content: CHAT_SYSTEM_PROMPT },
        ...messages,
      ],
      temperature: 0.6,
      max_tokens: 2048,
      stream: false,
    });

    const reply = response.choices[0]?.message?.content ?? "";

    return NextResponse.json({ reply });
  } catch (error) {
    console.error("Chat error:", error);
    return NextResponse.json(
      {
        error: "Chat failed",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
