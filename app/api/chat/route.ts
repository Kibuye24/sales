import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI, Content } from "@google/generative-ai";

let _genAI: GoogleGenerativeAI | null = null;

function getGenAI(): GoogleGenerativeAI {
  if (!_genAI) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) throw new Error("GEMINI_API_KEY is not configured");
    _genAI = new GoogleGenerativeAI(apiKey);
  }
  return _genAI;
}

const CHAT_SYSTEM_PROMPT = `You are a Glovo Sales Assistant in Nairobi, Kenya.
Help with:
- Sales strategies for Nairobi businesses
- Outreach drafts (warm and professional)
- Nairobi neighborhood market analysis
- Competitor context (Uber Eats, Bolt Food, Jumia Food)

Be concise and actionable.`;

interface ChatMessage {
  role: "user" | "assistant" | "system";
  content: string;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { messages } = body as { messages: ChatMessage[] };

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json({ error: "messages array is required" }, { status: 400 });
    }

    const genAI = getGenAI();
    const model = genAI.getGenerativeModel({ model: "gemini-3.1-flash-lite-preview" });

    // Map regular message roles to Gemini roles
    // Gemini roles: 'user', 'model' (instead of assistant)
    const history: Content[] = messages.slice(-10).map(m => ({
      role: m.role === "assistant" ? "model" : "user",
      parts: [{ text: m.content }]
    }));

    // System prompt usually goes as the first part or separate generation
    const chat = model.startChat({
      history: [
        { role: "user", parts: [{ text: CHAT_SYSTEM_PROMPT }] },
        { role: "model", parts: [{ text: "Understood. I am your Glovo Sales Assistant for Nairobi. How can I help you today?" }] },
        ...history.slice(0, -1) // All but the last message for history
      ]
    });

    const lastMessage = history[history.length - 1];
    const result = await chat.sendMessage(lastMessage.parts);
    const response = await result.response;
    const reply = response.text();

    return NextResponse.json({ reply });
  } catch (error) {
    console.error("Chat error:", error);
    return NextResponse.json(
      { error: "Chat failed", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}
