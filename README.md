# Phoenix Agent

A chatbot agent that helps you with Arize Phoenix.

It can be used to:

- Answer questions about Phoenix directly from the [Documentation](https://docs.arize.com/phoenix)
- Generate code snippets for instrumenting you TypeScript or Python code to send traces to Phoenix
- Directly read and perform actions on your live Phoenix instance
  - Create and update Prompts, Datasets, and Experiments with natural language

## Getting Started

1. Clone the repository

```bash
git clone https://github.com/cephalization/phoenix-agent.git
```

2. Install dependencies

```bash
cd phoenix-agent
# switch to the correct node version, install nvm first if you don't have it
nvm use
# install dependencies
npm install
```

3. Create a `.env.development` file and set the following environment variables:

```bash
PHOENIX_API_URL=http://localhost:6006
PHOENIX_API_KEY=your_api_key
OPENAI_API_KEY=your_openai_api_key
```

4. Run the agent (in dev mode)

```bash
npm run dev
```

5. Talk to the agent!

```bash
open http://localhost:4111/agents/phoenixAgent/chat
```

## How it works

The agent is built with [Mastra](https://github.com/mastra-ai/mastra/tree/main), an open-source framework for building agents.

Check out their [documentation](https://mastra.ai/en/docs) for information on how to deploy and extend the Phoenix Agent.
