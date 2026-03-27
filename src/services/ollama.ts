import type { OllamaChunk, OllamaMessage, OllamaTagsResponse } from '@/types/chat'

const BASE_URL = 'http://localhost:11434'

export async function fetchModels(): Promise<string[]> {
  const response = await fetch(`${BASE_URL}/api/tags`)
  if (!response.ok) {
    throw new Error(`Failed to fetch models: ${response.statusText}`)
  }
  const data: OllamaTagsResponse = await response.json()
  return data.models.map((m) => m.name)
}

export async function streamChat(
  model: string,
  messages: OllamaMessage[],
  onToken: (token: string) => void,
  onDone: () => void,
  onError: (error: Error) => void,
  signal?: AbortSignal,
): Promise<void> {
  let response: Response
  try {
    response = await fetch(`${BASE_URL}/api/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ model, messages, stream: true }),
      signal,
    })
  } catch (err) {
    if (err instanceof Error && err.name === 'AbortError') return
    onError(err instanceof Error ? err : new Error(String(err)))
    return
  }

  if (!response.ok) {
    onError(new Error(`Ollama error: ${response.status} ${response.statusText}`))
    return
  }

  if (!response.body) {
    onError(new Error('No response body'))
    return
  }

  const reader = response.body.getReader()
  const decoder = new TextDecoder()
  let buffer = ''

  try {
    while (true) {
      const { done, value } = await reader.read()
      if (done) break

      buffer += decoder.decode(value, { stream: true })
      const lines = buffer.split('\n')
      buffer = lines.pop() ?? ''

      for (const line of lines) {
        const trimmed = line.trim()
        if (!trimmed) continue
        try {
          const chunk: OllamaChunk = JSON.parse(trimmed)
          if (chunk.message?.content) {
            onToken(chunk.message.content)
          }
          if (chunk.done) {
            onDone()
            return
          }
        } catch {
          // skip malformed lines
        }
      }
    }
    // Handle any remaining buffer content
    if (buffer.trim()) {
      try {
        const chunk: OllamaChunk = JSON.parse(buffer.trim())
        if (chunk.message?.content) onToken(chunk.message.content)
        if (chunk.done) onDone()
      } catch {
        // ignore
      }
    }
  } catch (err) {
    if (err instanceof Error && err.name === 'AbortError') return
    onError(err instanceof Error ? err : new Error(String(err)))
  }
}
