import { openai } from "@ai-sdk/openai";
import { Agent } from "@mastra/core/agent";
import { Memory } from "@mastra/memory";
import { MCPClient } from "@mastra/mcp";

const phoenixMcp = ({
  apiKey,
  apiUrl,
  githubPersonalAccessToken,
}: {
  apiKey?: string;
  apiUrl?: string;
  githubPersonalAccessToken?: string;
}) => {
  let extraArgs: string[] = [];
  if (apiKey) {
    extraArgs.push(`--apiKey`, `${apiKey}`);
  }
  if (apiUrl) {
    extraArgs.push(`--baseUrl`, `${apiUrl}`);
  }
  if (!githubPersonalAccessToken) {
    console.warn(
      "GITHUB_PERSONAL_ACCESS_TOKEN is not set, Phoenix documentation and code search will not be available"
    );
  }
  return new MCPClient({
    servers: {
      phoenix: {
        command: "npx",
        args: ["-y", "@arizeai/phoenix-mcp@latest", ...extraArgs],
      },
      ...(githubPersonalAccessToken
        ? {
            github: {
              command: "docker",
              args: [
                "run",
                "-i",
                "--rm",
                // "-e",
                // "GITHUB_DYNAMIC_TOOLSETS=1",
                // "-e",
                // "GITHUB_TOOLSETS=repos",
                "-e",
                "GITHUB_MCP_TOOL_GET_FILE_CONTENTS=Get file contents from the Arize-ai/phoenix repository",
                "-e",
                `GITHUB_MCP_TOOL_SEARCH_CODE=Search the Arize-ai/phoenix repository for documentation or code`,
                "-e",
                `GITHUB_PERSONAL_ACCESS_TOKEN=${githubPersonalAccessToken}`,
                "ghcr.io/github/github-mcp-server",
              ],
            },
          }
        : {}),
    },
    timeout: 30_000,
  });
};

export const phoenixAgent = async ({
  apiKey,
  apiUrl,
  githubPersonalAccessToken,
}: {
  apiKey?: string;
  apiUrl?: string;
  githubPersonalAccessToken?: string;
}) => {
  const mcp = phoenixMcp({ apiKey, apiUrl, githubPersonalAccessToken });
  const mcpTools = await mcp.getTools();
  return new Agent({
    name: "Phoenix Agent",
    instructions: `
        You are an expert user of the Phoenix LLM observability platform by Arize AI. Analyze the user's query and provide practical recommendations or actions.

        The github repository for Phoenix is at https://github.com/Arize-ai/phoenix

        Guidelines:
        - Answer all questions about Phoenix by searching the Phoenix repository using the Github tool and reading the relevant documentation
        - Always search against the Phoenix repository Arize-ai/phoenix when accessing github
        - Documentation is written in markdown, so be sure to filter by the markdown language when searching github for documentation
        - Documentation is located in the top level 'docs' directory
        - After searching for documentation, fetch the file contents for the first result
        - Keep descriptions concise but informative
        - Always search against the Phoenix repository Arize-ai/phoenix when accessing github
      `,
    model: openai("gpt-4o"),
    tools: { ...mcpTools },
    defaultGenerateOptions: { telemetry: { isEnabled: true } },
    defaultStreamOptions: { telemetry: { isEnabled: true } },
    memory: new Memory({
      options: {
        lastMessages: 10,
        semanticRecall: false,
        threads: {
          generateTitle: false,
        },
      },
    }),
  });
};
