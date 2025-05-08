import { openai } from "@ai-sdk/openai";
import { Agent } from "@mastra/core/agent";
import { Step, Workflow } from "@mastra/core/workflows";
import { z } from "zod";

const llm = openai("gpt-4o");

const agent = new Agent({
  name: "Phoenix Agent",
  model: llm,
  instructions: `
        You are an expert user of the Phoenix LLM observability platform by Arize AI. Analyze the user's query and provide practical recommendations or actions.

        Guidelines:
        - Answer general LLM observability questions with answers focused on features and capabilities of the Phoenix platform
        - Actions should be performed on the user's behalf if one or many tools exist to facilitate the action
        - Keep descriptions concise but informative
      `,
});
