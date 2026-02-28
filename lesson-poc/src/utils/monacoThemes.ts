import type { Monaco } from '@monaco-editor/react'
import themesCSS from '../styles/themes.css?raw'
import { cssVarsToMonacoTheme, parseThemeBlocks } from './cssVarsToMonacoTheme'
import type { Theme } from '../hooks/useTheme'

const LIGHT_THEMES = new Set<string>(['light'])

const themeBlocks = parseThemeBlocks(themesCSS)

/** Call this in the Monaco editor's beforeMount handler. Idempotent. */
export function registerMonacoThemes(monaco: Monaco): void {
  for (const [name, css] of Object.entries(themeBlocks)) {
    const base = LIGHT_THEMES.has(name) ? 'vs' : 'vs-dark'
    monaco.editor.defineTheme(name, cssVarsToMonacoTheme(css, base))
  }
}

/** Maps an app theme to the corresponding registered Monaco theme name. */
export function monacoThemeName(appTheme: Theme): string {
  return appTheme in themeBlocks ? appTheme : (appTheme === 'light' ? 'vs' : 'vs-dark')
}
