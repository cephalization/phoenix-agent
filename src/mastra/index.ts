import { Mastra } from "@mastra/core/mastra";
import { createLogger } from "@mastra/core/logger";
import { LibSQLStore } from "@mastra/libsql";
import { phoenixAgent } from "./agents";
import { OpenInferenceOTLPTraceExporter } from "@arizeai/openinference-mastra";
import { env } from "./env";

export const mastra = new Mastra({
  agents: {
    phoenixAgent: await phoenixAgent({
      apiKey: env.PHOENIX_API_KEY,
      apiUrl: env.PHOENIX_API_URL,
      githubPersonalAccessToken: env.GITHUB_PERSONAL_ACCESS_TOKEN,
    }),
  },
  storage: new LibSQLStore({
    // stores telemetry, evals, ... into memory storage, if it needs to persist, change to file:../mastra.db
    url: ":memory:",
  }),
  logger: createLogger({
    name: "Mastra",
    level: "info",
  }),
  telemetry: {
    enabled: true,
    serviceName: "phoenix-agent",
    disableLocalExport: false,
    export: {
      type: "custom",
      exporter: new OpenInferenceOTLPTraceExporter({
        apiKey: env.PHOENIX_API_KEY,
        collectorEndpoint: `${env.PHOENIX_API_URL}/v1/traces`,
      }),
    },
  },
});
