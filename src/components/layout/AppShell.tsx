import { ChatContainer } from '@/components/ChatContainer'
import { Header } from '@/components/Header'
import { InputBar } from '@/components/InputBar'
import { useChat } from '@/hooks/useChat'

interface AppShellProps {
  models: string[]
  selectedModel: string
  onModelChange: (model: string) => void
}

export function AppShell({ models, selectedModel, onModelChange }: AppShellProps) {
  const { messages, streamingContent, isStreaming, error, sendMessage, stopStreaming, clearHistory } =
    useChat(selectedModel)

  return (
    <div className="flex h-screen flex-col bg-background">
      <Header
        models={models}
        selectedModel={selectedModel}
        onModelChange={onModelChange}
        onClear={clearHistory}
        isStreaming={isStreaming}
      />

      {error && (
        <div className="bg-destructive/10 px-4 py-2 text-sm text-destructive">
          <strong>Error:</strong> {error}
        </div>
      )}

      <ChatContainer
        messages={messages}
        streamingContent={streamingContent}
        isStreaming={isStreaming}
      />

      <InputBar
        onSend={sendMessage}
        onStop={stopStreaming}
        isStreaming={isStreaming}
        disabled={!selectedModel || models.length === 0}
      />
    </div>
  )
}
