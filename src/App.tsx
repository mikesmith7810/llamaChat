import { useEffect, useState } from 'react'
import { ThemeProvider } from '@/components/ThemeProvider'
import { AppShell } from '@/components/layout/AppShell'
import { fetchModels } from '@/services/ollama'

export default function App() {
  const [models, setModels] = useState<string[]>([])
  const [selectedModel, setSelectedModel] = useState('')

  useEffect(() => {
    fetchModels()
      .then((list) => {
        setModels(list)
        if (list.length > 0) setSelectedModel(list[0])
      })
      .catch(() => {
        // Ollama not running — error shown in InputBar placeholder
      })
  }, [])

  return (
    <ThemeProvider>
      <AppShell
        models={models}
        selectedModel={selectedModel}
        onModelChange={setSelectedModel}
      />
    </ThemeProvider>
  )
}
