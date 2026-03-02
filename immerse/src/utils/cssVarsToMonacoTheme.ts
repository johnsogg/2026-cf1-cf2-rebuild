/**
 * Converts a CSS custom-property block into a Monaco defineTheme config.
 *
 * Usage:
 *   const css = `
 *     --bg: #0f0e17;
 *     --text: #fffffe;
 *     --hljs-keyword: #ffd700;
 *     ...
 *   `
 *   const themeData = cssVarsToMonacoTheme(css, 'vs-dark')
 *   monaco.editor.defineTheme('mytheme', themeData)
 *
 * The CSS input can be the raw contents of a [data-theme="..."] { } block,
 * or just the variable declarations inside it — either works.
 */

type MonacoThemeData = {
  base: 'vs' | 'vs-dark' | 'hc-black'
  inherit: boolean
  rules: Array<{ token: string; foreground?: string; fontStyle?: string }>
  colors: Record<string, string>
}

// CSS variable → Monaco editor color keys
// https://code.visualstudio.com/api/references/theme-color
const COLOR_MAP: Record<string, string[]> = {
  '--bg': [
    'editor.background',
    'editorWidget.background',
    'editorSuggestWidget.background',
    'editorHoverWidget.background',
    'minimap.background',
  ],
  '--text': [
    'editor.foreground',
    'editorSuggestWidget.foreground',
    'editorHoverWidget.foreground',
  ],
  '--text-muted': [
    'editorLineNumber.foreground',
    'editorGhostText.foreground',
  ],
  '--accent': [
    'editorCursor.foreground',
    'editorSuggestWidget.highlightForeground',
    'editorLineNumber.activeForeground',
  ],
  '--accent-subtle': [
    'editor.selectionBackground',
    'editor.inactiveSelectionBackground',
    'editorSuggestWidget.selectedBackground',
    'editor.wordHighlightBackground',
  ],
  '--border': [
    'editorWidget.border',
    'editorSuggestWidget.border',
    'editorHoverWidget.border',
  ],
  '--border-light': [
    'editorIndentGuide.background1',
    'editorRuler.foreground',
  ],
  '--code-bg': [
    'editor.lineHighlightBackground',
  ],
}

// CSS variable → TextMate token scopes
// Rules foreground values must be hex WITHOUT the leading #
const TOKEN_MAP: Record<string, string[]> = {
  '--hljs-keyword': [
    'keyword',
    'keyword.control',
    'keyword.operator',
    'storage',
    'storage.type',
    'storage.modifier',
  ],
  '--hljs-title': [
    'entity.name.function',
    'entity.name.type',
    'entity.name.class',
    'entity.other.inherited-class',
  ],
  '--hljs-constant': [
    'constant.numeric',
    'constant.language',
    'constant.character',
    'variable.language',
    'support.constant',
    'support.type.property-name',
  ],
  '--hljs-string': [
    'string',
    'string.quoted',
    'string.template',
  ],
  '--hljs-builtin': [
    'support.function',
    'support.class',
    'support.type',
  ],
  '--hljs-comment': [
    'comment',
    'comment.line',
    'comment.block',
    'punctuation.definition.comment',
  ],
  '--hljs-tag': [
    'entity.name.tag',
    'support.class.component',
  ],
  '--hljs-subst': [
    'variable',
    'variable.other',
    'variable.other.readwrite',
  ],
}

function stripHash(hex: string): string {
  return hex.startsWith('#') ? hex.slice(1) : hex
}

/**
 * Extract per-theme variable blocks from a full themes.css string.
 * Returns a map of theme name → raw CSS variable declarations.
 *
 * Example input:
 *   [data-theme="dark"] { --bg: #0d1117; --text: #e6edf3; }
 * Returns: { dark: '  --bg: #0d1117;\n  --text: #e6edf3;\n' }
 */
export function parseThemeBlocks(css: string): Record<string, string> {
  const blocks: Record<string, string> = {}
  for (const match of css.matchAll(/\[data-theme="([^"]+)"\]\s*\{([^}]+)\}/g)) {
    blocks[match[1]] = match[2]
  }
  return blocks
}

/** Parse `--name: value;` pairs from a CSS string. */
function parseCssVars(css: string): Record<string, string> {
  const vars: Record<string, string> = {}
  for (const match of css.matchAll(/--[\w-]+\s*:\s*([^;]+);/g)) {
    const [full, value] = match
    const name = full.slice(0, full.indexOf(':'))
    vars[name.trim()] = value.trim()
  }
  return vars
}

export function cssVarsToMonacoTheme(
  css: string,
  base: 'vs' | 'vs-dark' | 'hc-black' = 'vs-dark',
): MonacoThemeData {
  const vars = parseCssVars(css)

  const colors: Record<string, string> = {}
  for (const [cssVar, monacoKeys] of Object.entries(COLOR_MAP)) {
    const value = vars[cssVar]
    if (!value) continue
    for (const key of monacoKeys) {
      colors[key] = value // Monaco colors keep the # prefix
    }
  }

  const rules: MonacoThemeData['rules'] = []
  for (const [cssVar, tokens] of Object.entries(TOKEN_MAP)) {
    const value = vars[cssVar]
    if (!value) continue
    for (const token of tokens) {
      rules.push({ token, foreground: stripHash(value) })
    }
  }

  return { base, inherit: true, rules, colors }
}
