# llamaChat

A professional Claude.ai-style chat UI for locally running Ollama models.

## Features

- Streaming responses with real-time token display
- Multi-turn conversation context
- Light / dark mode with system-preference detection and localStorage persistence
- Model selector (dynamically fetches available models from Ollama)
- Stop button to interrupt generation mid-response
- Clear conversation history
- Auto-scrolling chat window
- Auto-growing textarea input

## Prerequisites

- Node.js 18+
- [Ollama](https://ollama.com) installed and running
- At least one model pulled, e.g. `ollama pull llama3.2`

## Getting Started

```bash
# 1. Clone and install
git clone <your-repo-url>
cd llamachat
npm install

# 2. Start Ollama (in a separate terminal)
ollama serve

# 3. Pull a model if you haven't already
ollama pull llama3.2

# 4. Run the dev server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

> **Note:** llamaChat connects to Ollama at `http://localhost:11434`. Make sure Ollama is running before starting the app.

## Build for Production

```bash
npm run build
npm run preview
```

## Tech Stack

| Tool | Version |
|------|---------|
| React | 18 |
| Vite | 6 |
| TypeScript | 5 |
| Tailwind CSS | 3 |
| shadcn/ui | latest |
| lucide-react | latest |

## Project Structure

```
src/
├── App.tsx                    # Root component — fetches models, holds selectedModel state
├── main.tsx                   # React entry point
├── index.css                  # Tailwind directives + CSS variables (light + dark)
├── types/
│   └── chat.ts                # Shared TypeScript types
├── services/
│   └── ollama.ts              # Ollama API: fetchModels(), streamChat()
├── hooks/
│   ├── useChat.ts             # Chat state management + streaming logic
│   └── useTheme.ts            # Theme toggle + localStorage persistence
└── components/
    ├── ui/                    # shadcn/ui auto-generated components
    ├── ThemeProvider.tsx      # Theme context
    ├── Header.tsx             # Brand, model selector, clear button, theme toggle
    ├── ChatContainer.tsx      # Scrollable message list + empty state
    ├── MessageBubble.tsx      # User / assistant message bubbles
    ├── InputBar.tsx           # Auto-growing textarea + send/stop button
    └── layout/
        └── AppShell.tsx       # Main layout wiring hooks to UI
```
