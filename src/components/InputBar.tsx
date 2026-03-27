import { useCallback, useRef } from 'react'
import { Send, Square } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'

interface InputBarProps {
  onSend: (message: string) => void
  onStop: () => void
  isStreaming: boolean
  disabled: boolean
}

export function InputBar({ onSend, onStop, isStreaming, disabled }: InputBarProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const handleInput = () => {
    const el = textareaRef.current
    if (!el) return
    el.style.height = 'auto'
    el.style.height = `${Math.min(el.scrollHeight, 240)}px`
  }

  const handleSend = useCallback(() => {
    const el = textareaRef.current
    if (!el) return
    const value = el.value.trim()
    if (!value || isStreaming || disabled) return
    onSend(value)
    el.value = ''
    el.style.height = 'auto'
  }, [onSend, isStreaming, disabled])

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className="border-t border-border bg-background px-4 pb-6 pt-4">
      <div className="mx-auto flex w-full max-w-[1200px] items-end gap-3">
        <Textarea
          ref={textareaRef}
          rows={3}
          placeholder={disabled ? 'No model selected — start Ollama and refresh' : 'Message… (Enter to send, Shift+Enter for newline)'}
          onInput={handleInput}
          onKeyDown={handleKeyDown}
          disabled={isStreaming || disabled}
          className="max-h-60 min-h-[80px] flex-1 resize-none overflow-y-auto"
        />
        {isStreaming ? (
          <Button
            variant="destructive"
            size="icon"
            onClick={onStop}
            className="shrink-0"
            title="Stop generating"
          >
            <Square className="h-4 w-4" />
          </Button>
        ) : (
          <Button
            size="icon"
            onClick={handleSend}
            disabled={disabled}
            className="shrink-0"
            title="Send message"
          >
            <Send className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  )
}
