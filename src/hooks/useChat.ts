import { useCallback, useRef, useState } from 'react'
import { streamChat } from '@/services/ollama'
import type { ChatMessage, OllamaMessage } from '@/types/chat'

function makeId() {
  return Math.random().toString(36).slice(2)
}

export function useChat(selectedModel: string) {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [streamingContent, setStreamingContent] = useState('')
  const [isStreaming, setIsStreaming] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const abortControllerRef = useRef<AbortController | null>(null)

  const sendMessage = useCallback(
    (input: string) => {
      if (!input.trim() || isStreaming || !selectedModel) return

      setError(null)
      const userMessage: ChatMessage = {
        id: makeId(),
        role: 'user',
        content: input.trim(),
        timestamp: new Date(),
      }

      setMessages((prev) => {
        const updated = [...prev, userMessage]
        const history: OllamaMessage[] = updated.map((m) => ({
          role: m.role,
          content: m.content,
        }))

        const controller = new AbortController()
        abortControllerRef.current = controller
        setIsStreaming(true)
        setStreamingContent('')

        let accumulated = ''

        streamChat(
          selectedModel,
          history,
          (token) => {
            accumulated += token
            setStreamingContent(accumulated)
          },
          () => {
            const assistantMessage: ChatMessage = {
              id: makeId(),
              role: 'assistant',
              content: accumulated,
              timestamp: new Date(),
            }
            setMessages((prev) => [...prev, assistantMessage])
            setStreamingContent('')
            setIsStreaming(false)
            abortControllerRef.current = null
          },
          (err) => {
            setError(err.message)
            setIsStreaming(false)
            setStreamingContent('')
            abortControllerRef.current = null
          },
          controller.signal,
        )

        return updated
      })
    },
    [isStreaming, selectedModel],
  )

  const stopStreaming = useCallback(() => {
    abortControllerRef.current?.abort()
    setIsStreaming(false)
    if (streamingContent.trim()) {
      setMessages((prev) => [
        ...prev,
        {
          id: makeId(),
          role: 'assistant',
          content: streamingContent,
          timestamp: new Date(),
        },
      ])
    }
    setStreamingContent('')
  }, [streamingContent])

  const clearHistory = useCallback(() => {
    if (isStreaming) return
    setMessages([])
    setError(null)
  }, [isStreaming])

  return { messages, streamingContent, isStreaming, error, sendMessage, stopStreaming, clearHistory }
}
