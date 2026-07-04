import {
  createElement,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react"
import type { ReactNode } from "react"
import { getStorageValue, setStorageValue } from "../storage"

export type Theme =
  | "light"
  | "dark"
  | "clouds"
  | "disco"
  | "neon"
  | "cyberpunk"
  | "college-dormitory"

type ThemeContextValue = [Theme, (t: Theme) => void]

const ThemeContext = createContext<ThemeContextValue | null>(null)

function getInitialTheme(): Theme {
  const saved = getStorageValue((d) => d.theme) as Theme | undefined
  if (saved) return saved
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light"
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>(getInitialTheme)

  // Set synchronously during render (not in an effect) so the DOM attribute
  // - and the CSS custom properties it selects - are already updated by the
  // time any descendant's useLayoutEffect runs in this same commit.
  document.documentElement.dataset.theme = theme

  // Follow system preference when user hasn't explicitly chosen a theme
  useEffect(() => {
    const mq = window.matchMedia("(prefers-color-scheme: dark)")
    const handler = (e: MediaQueryListEvent) => {
      if (!getStorageValue((d) => d.theme)) {
        setThemeState(e.matches ? "dark" : "light")
      }
    }
    mq.addEventListener("change", handler)
    return () => mq.removeEventListener("change", handler)
  }, [])

  const setTheme = (t: Theme) => {
    setStorageValue((d) => {
      d.theme = t
    })
    setThemeState(t)
  }

  return createElement(
    ThemeContext.Provider,
    { value: [theme, setTheme] },
    children,
  )
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider")
  return ctx
}
