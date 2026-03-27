export interface OllamaMessage {
  role: 'user' | 'assistant' | 'system'
  content: string
}

export interface OllamaChunk {
  model: string
  message: OllamaMessage
  done: boolean
}

export interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

export interface OllamaTagsResponse {
  models: { name: string; modified_at: string; size: number }[]
}

export type Theme = 'light' | 'dark'
