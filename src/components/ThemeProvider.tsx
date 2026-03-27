import { createContext, useContext } from 'react'
import { useTheme } from '@/hooks/useTheme'
import type { Theme } from '@/types/chat'

interface ThemeContextValue {
  theme: Theme
  toggleTheme: () => void
}

const ThemeContext = createContext<ThemeContextValue | null>(null)

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const themeValue = useTheme()
  return <ThemeContext.Provider value={themeValue}>{children}</ThemeContext.Provider>
}

export function useThemeContext() {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error('useThemeContext must be used within ThemeProvider')
  return ctx
}
