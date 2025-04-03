import { NextRequest, NextResponse } from "next/server";
import { generateText, tool } from "ai";
import { openrouter } from "@/ai/open-router";
import { z } from "zod";

export async function GET(request: NextRequest) {
  const result = await generateText({
    model: openrouter.chat("google/gemini-pro"), // Modelo gratuito
    // model: openrouter.chat("openai/gpt-4o-2024-11-20"), // Modelo pago do gpt
    tools: {
      profileAndUrls: tool({
        description:
          "Essa ferramente serve para buscar dados do perfil de um usuário do GitHub ou acessar URLs da API para outras informações de um usuários como lista de organizações, repositórios, eventos, seguidores, seguindo etc...",
        parameters: z.object({
          username: z.string().describe("Nome do usuário no GitHub"),
        }),
        execute: async ({ username }) => {
          const response = await fetch(`https://api.github.com/users/${username}`);
          const data = await response.json();

          return JSON.stringify(data);
        },
      }),

      fetchHTTP: tool({
        description:
          "Essa ferramenta serve para realizar uma requisição HTTP em uma URL especificada e acessar sua resposta",
        parameters: z.object({
          url: z.string().url().describe("URL a ser requisitada"),
        }),
        execute: async ({ url }) => {
          const response = await fetch(url);
          const data = await response.text();

          return JSON.stringify(data);
        },
      }),
    },
    prompt: "Me dê uma lista de usuário que o usuário diego3g segue no GitHub?",
    maxSteps: 5,

    onStepFinish({ toolResults }) {
      console.log("Tool results:", toolResults);
    },
  });

  return NextResponse.json({ message: result.text });
}
