import { github } from "@/lib/octokit";
import { tool } from "ai";
import { z } from "zod";

export const githubProfile = tool({
  description:
    "Essa ferramente serve para buscar dados do perfil de um usuário do GitHub ou acessar URLs da API para outras informações de um usuários como lista de organizações, repositórios, eventos, seguidores, seguindo etc...",
  parameters: z.object({
    username: z.string().describe("Nome do usuário no GitHub"),
  }),
  execute: async ({ username }) => {
    const response = await github.users.getByUsername({ username });

    return response.data;
  },
});
