import { NextRequest } from "next/server";
import { streamText } from "ai";
import { openrouter } from "@/ai/open-router";
import { tools } from "@/ai/tools";

export async function POST(request: NextRequest) {
  const { messages } = await request.json();

  const result = streamText({
    model: openrouter.chat("google/gemini-pro"), // Modelo gratuito
    // model: openrouter.chat("openai/gpt-4o-2024-11-20"), // Modelo pago do gpt
    tools,
    messages,
    maxSteps: 5,
    system: `
      Sempre responda em markdown sem aspas no início ou fim da mensagem
    `,
  });

  return result.toDataStreamResponse();
}
