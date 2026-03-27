import { Moon, Sun, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useThemeContext } from '@/components/ThemeProvider'

interface HeaderProps {
  models: string[]
  selectedModel: string
  onModelChange: (model: string) => void
  onClear: () => void
  isStreaming: boolean
}

export function Header({ models, selectedModel, onModelChange, onClear, isStreaming }: HeaderProps) {
  const { theme, toggleTheme } = useThemeContext()

  return (
    <header className="flex items-center justify-between border-b border-border bg-background px-4 py-3 shadow-sm">
      <div className="flex items-center gap-2">
        <span className="text-xl font-bold tracking-tight text-foreground">🦙 llamaChat</span>
      </div>

      <div className="flex items-center gap-2">
        {models.length > 0 ? (
          <Select value={selectedModel} onValueChange={onModelChange} disabled={isStreaming}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Select model" />
            </SelectTrigger>
            <SelectContent>
              {models.map((m) => (
                <SelectItem key={m} value={m}>
                  {m}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        ) : (
          <span className="text-sm text-muted-foreground">No models found</span>
        )}

        <Button
          variant="ghost"
          size="icon"
          onClick={onClear}
          disabled={isStreaming}
          title="Clear conversation"
        >
          <Trash2 className="h-4 w-4" />
        </Button>

        <Button variant="ghost" size="icon" onClick={toggleTheme} title="Toggle theme">
          {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </Button>
      </div>
    </header>
  )
}
