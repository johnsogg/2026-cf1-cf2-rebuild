import { createElement, createContext, useContext, useEffect, useState } from 'react'
import type { ReactNode } from 'react'

export type Theme = 'light' | 'dark' | 'neon' | 'cyberpunk' | 'college-dormitory'

type ThemeContextValue = [Theme, (t: Theme) => void]

const ThemeContext = createContext<ThemeContextValue | null>(null)

function getInitialTheme(): Theme {
  const saved = localStorage.getItem('theme') as Theme | null
  if (saved) return saved
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>(getInitialTheme)

  useEffect(() => {
    document.documentElement.dataset.theme = theme
  }, [theme])

  // Follow system preference when user hasn't explicitly chosen a theme
  useEffect(() => {
    const mq = window.matchMedia('(prefers-color-scheme: dark)')
    const handler = (e: MediaQueryListEvent) => {
      if (!localStorage.getItem('theme')) {
        setThemeState(e.matches ? 'dark' : 'light')
      }
    }
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])

  const setTheme = (t: Theme) => {
    localStorage.setItem('theme', t)
    setThemeState(t)
  }

  return createElement(ThemeContext.Provider, { value: [theme, setTheme] }, children)
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider')
  return ctx
}
