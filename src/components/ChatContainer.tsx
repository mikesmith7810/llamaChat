import { useEffect, useRef } from 'react'
import { Bot } from 'lucide-react'
import { MessageBubble } from '@/components/MessageBubble'
import type { ChatMessage } from '@/types/chat'

interface ChatContainerProps {
  messages: ChatMessage[]
  streamingContent: string
  isStreaming: boolean
}

export function ChatContainer({ messages, streamingContent, isStreaming }: ChatContainerProps) {
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, streamingContent])

  const isEmpty = messages.length === 0 && !isStreaming

  return (
    <div className="flex flex-1 flex-col overflow-y-auto">
      {isEmpty ? (
        <div className="flex flex-1 flex-col items-center justify-center gap-3 text-muted-foreground">
          <Bot className="h-12 w-12 opacity-30" />
          <p className="text-sm">Select a model and start chatting</p>
        </div>
      ) : (
        <div className="mx-auto flex w-full max-w-[1200px] flex-col gap-1 py-4">
          {messages.map((message) => (
            <MessageBubble key={message.id} message={message} />
          ))}
          {isStreaming && streamingContent && (
            <MessageBubble
              key="__streaming__"
              message={{
                id: '__streaming__',
                role: 'assistant',
                content: streamingContent,
                timestamp: new Date(),
              }}
              isStreaming={true}
            />
          )}
        </div>
      )}
      <div ref={bottomRef} />
    </div>
  )
}
