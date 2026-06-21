import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import s from './Kbd.module.css'

type ModKey = 'fn' | 'ctrl' | 'alt' | 'shift' | 'cmd'
type Platform = 'mac' | 'win' | null

type PlatformCombo = { mods: ModKey[]; key: string }
type OpEntry = { mac: PlatformCombo; win: PlatformCombo }
export type OpMap = Record<string, OpEntry>
export type BuiltinMapName = 'vscode' | 'monaco'

// Canonical Apple HIG modifier order: fn → ⌃ → ⌥ → ⇧ → ⌘
const MOD_ORDER: ModKey[] = ['fn', 'ctrl', 'alt', 'shift', 'cmd']

const MAC_MOD: Record<ModKey, string> = { fn: 'fn', ctrl: '⌃', alt: '⌥', shift: '⇧', cmd: '⌘' }
const WIN_MOD: Record<ModKey, string> = { fn: 'fn', ctrl: 'Ctrl', alt: 'Alt', shift: 'Shift', cmd: 'Win' }

const MAC_KEY: Record<string, string> = {
  Enter: '↩', Esc: '⎋', Tab: '⇥', Backspace: '⌫', Delete: '⌦',
  Up: '↑', Down: '↓', Left: '←', Right: '→',
  PageUp: '⇞', PageDown: '⇟', Home: '↖', End: '↘', Space: '␣',
}

function sortMods(mods: ModKey[]): ModKey[] {
  return [...mods].sort((a, b) => MOD_ORDER.indexOf(a) - MOD_ORDER.indexOf(b))
}

function renderMacStr(mods: ModKey[], key: string): string {
  return sortMods(mods).map(m => MAC_MOD[m]).join('') + (MAC_KEY[key] ?? key)
}

function renderWinStr(mods: ModKey[], key: string): string {
  const parts = [...sortMods(mods).map(m => WIN_MOD[m]), key]
  return parts.join('+')
}

// ---- Built-in op maps ----

const defaultOpMap: OpMap = {
  copy:           { mac: { mods: ['cmd'],         key: 'C'    }, win: { mods: ['ctrl'],         key: 'C'    } },
  cut:            { mac: { mods: ['cmd'],         key: 'X'    }, win: { mods: ['ctrl'],         key: 'X'    } },
  paste:          { mac: { mods: ['cmd'],         key: 'V'    }, win: { mods: ['ctrl'],         key: 'V'    } },
  'paste-plain':  { mac: { mods: ['shift','cmd'], key: 'V'    }, win: { mods: ['ctrl','shift'], key: 'V'    } },
  undo:           { mac: { mods: ['cmd'],         key: 'Z'    }, win: { mods: ['ctrl'],         key: 'Z'    } },
  redo:           { mac: { mods: ['shift','cmd'], key: 'Z'    }, win: { mods: ['ctrl'],         key: 'Y'    } },
  'select-all':   { mac: { mods: ['cmd'],         key: 'A'    }, win: { mods: ['ctrl'],         key: 'A'    } },
  save:           { mac: { mods: ['cmd'],         key: 'S'    }, win: { mods: ['ctrl'],         key: 'S'    } },
  open:           { mac: { mods: ['cmd'],         key: 'O'    }, win: { mods: ['ctrl'],         key: 'O'    } },
  find:           { mac: { mods: ['cmd'],         key: 'F'    }, win: { mods: ['ctrl'],         key: 'F'    } },
  'find-replace': { mac: { mods: ['alt','cmd'],   key: 'F'    }, win: { mods: ['ctrl'],         key: 'H'    } },
  new:            { mac: { mods: ['cmd'],         key: 'N'    }, win: { mods: ['ctrl'],         key: 'N'    } },
  'close-tab':    { mac: { mods: ['cmd'],         key: 'W'    }, win: { mods: ['ctrl'],         key: 'W'    } },
  quit:           { mac: { mods: ['cmd'],         key: 'Q'    }, win: { mods: ['alt'],          key: 'F4'   } },
  escape:         { mac: { mods: [],              key: 'Esc'  }, win: { mods: [],              key: 'Esc'  } },
  bold:           { mac: { mods: ['cmd'],         key: 'B'    }, win: { mods: ['ctrl'],         key: 'B'    } },
  italic:         { mac: { mods: ['cmd'],         key: 'I'    }, win: { mods: ['ctrl'],         key: 'I'    } },
  'zoom-in':      { mac: { mods: ['cmd'],         key: '+'    }, win: { mods: ['ctrl'],         key: '+'    } },
  'zoom-out':     { mac: { mods: ['cmd'],         key: '-'    }, win: { mods: ['ctrl'],         key: '-'    } },
  'full-screen':  { mac: { mods: ['ctrl','cmd'],  key: 'F'    }, win: { mods: [],              key: 'F11'  } },
}

const vscodeOpMap: OpMap = {
  ...defaultOpMap,
  'command-palette':  { mac: { mods: ['shift','cmd'],  key: 'P'     }, win: { mods: ['ctrl','shift'],  key: 'P'     } },
  'quick-open':       { mac: { mods: ['cmd'],          key: 'P'     }, win: { mods: ['ctrl'],          key: 'P'     } },
  'open-terminal':    { mac: { mods: ['ctrl'],         key: '`'     }, win: { mods: ['ctrl'],          key: '`'     } },
  'toggle-sidebar':   { mac: { mods: ['cmd'],          key: 'B'     }, win: { mods: ['ctrl'],          key: 'B'     } },
  'split-editor':     { mac: { mods: ['cmd'],          key: '\\'    }, win: { mods: ['ctrl'],          key: '\\'    } },
  'format-document':  { mac: { mods: ['shift','alt'],  key: 'F'     }, win: { mods: ['shift','alt'],   key: 'F'     } },
  'comment-line':     { mac: { mods: ['cmd'],          key: '/'     }, win: { mods: ['ctrl'],          key: '/'     } },
  'comment-block':    { mac: { mods: ['shift','alt'],  key: 'A'     }, win: { mods: ['shift','alt'],   key: 'A'     } },
  'go-to-definition': { mac: { mods: [],               key: 'F12'   }, win: { mods: [],               key: 'F12'   } },
  'peek-definition':  { mac: { mods: ['alt'],          key: 'F12'   }, win: { mods: ['alt'],           key: 'F12'   } },
  'go-to-line':       { mac: { mods: ['ctrl'],         key: 'G'     }, win: { mods: ['ctrl'],          key: 'G'     } },
  'find-in-files':    { mac: { mods: ['shift','cmd'],  key: 'F'     }, win: { mods: ['ctrl','shift'],  key: 'F'     } },
  'rename-symbol':    { mac: { mods: [],               key: 'F2'    }, win: { mods: [],               key: 'F2'    } },
  'delete-line':      { mac: { mods: ['shift','cmd'],  key: 'K'     }, win: { mods: ['ctrl','shift'],  key: 'K'     } },
  'select-word':      { mac: { mods: ['cmd'],          key: 'D'     }, win: { mods: ['ctrl'],          key: 'D'     } },
  'move-line-up':     { mac: { mods: ['alt'],          key: 'Up'    }, win: { mods: ['alt'],           key: 'Up'    } },
  'move-line-down':   { mac: { mods: ['alt'],          key: 'Down'  }, win: { mods: ['alt'],           key: 'Down'  } },
  'copy-line-up':     { mac: { mods: ['shift','alt'],  key: 'Up'    }, win: { mods: ['shift','alt'],   key: 'Up'    } },
  'copy-line-down':   { mac: { mods: ['shift','alt'],  key: 'Down'  }, win: { mods: ['shift','alt'],   key: 'Down'  } },
  'add-cursor-above': { mac: { mods: ['alt','cmd'],    key: 'Up'    }, win: { mods: ['ctrl','alt'],    key: 'Up'    } },
  'add-cursor-below': { mac: { mods: ['alt','cmd'],    key: 'Down'  }, win: { mods: ['ctrl','alt'],    key: 'Down'  } },
  'expand-selection': { mac: { mods: ['shift','alt'],  key: 'Right' }, win: { mods: ['shift','alt'],   key: 'Right' } },
  'shrink-selection': { mac: { mods: ['shift','alt'],  key: 'Left'  }, win: { mods: ['shift','alt'],   key: 'Left'  } },
}

// Monaco: editor-level shortcuts only (no IDE-level ops like command palette, terminal, sidebar)
const monacoOpMap: OpMap = {
  ...defaultOpMap,
  'find-replace':     vscodeOpMap['find-replace'],
  'format-document':  vscodeOpMap['format-document'],
  'comment-line':     vscodeOpMap['comment-line'],
  'comment-block':    vscodeOpMap['comment-block'],
  'go-to-definition': vscodeOpMap['go-to-definition'],
  'go-to-line':       vscodeOpMap['go-to-line'],
  'delete-line':      vscodeOpMap['delete-line'],
  'select-word':      vscodeOpMap['select-word'],
  'move-line-up':     vscodeOpMap['move-line-up'],
  'move-line-down':   vscodeOpMap['move-line-down'],
  'copy-line-up':     vscodeOpMap['copy-line-up'],
  'copy-line-down':   vscodeOpMap['copy-line-down'],
  'add-cursor-above': vscodeOpMap['add-cursor-above'],
  'add-cursor-below': vscodeOpMap['add-cursor-below'],
  'expand-selection': vscodeOpMap['expand-selection'],
  'shrink-selection': vscodeOpMap['shrink-selection'],
}

export const builtinMaps: Record<BuiltinMapName, OpMap> = {
  vscode: vscodeOpMap,
  monaco: monacoOpMap,
}

// ---- Context & Provider ----

const KbdContext = createContext<OpMap>(defaultOpMap)

export function KbdProvider({ map, children }: { map: BuiltinMapName | OpMap; children: ReactNode }) {
  const resolved = typeof map === 'string' ? builtinMaps[map] : map
  return <KbdContext.Provider value={resolved}>{children}</KbdContext.Provider>
}

// ---- Platform detection ----

function usePlatform(): Platform {
  const [platform, setPlatform] = useState<Platform>(null)
  useEffect(() => {
    setPlatform(/mac/i.test(navigator.userAgent) ? 'mac' : 'win')
  }, [])
  return platform
}

// ---- Component ----

export interface KbdProps {
  cmd?: boolean
  shift?: boolean
  alt?: boolean
  ctrl?: boolean
  fn?: boolean
  mod?: boolean
  op?: string
  children?: string
}

function renderBoth(macMods: ModKey[], winMods: ModKey[], key: string) {
  return (
    <span className={s.ssrBoth}>
      <kbd className={s.kbd}>{renderMacStr(macMods, key)}</kbd>
      <span className={s.ssrLabel}>(mac)</span>
      {' / '}
      <kbd className={s.kbd}>{renderWinStr(winMods, key)}</kbd>
      <span className={s.ssrLabel}>(win)</span>
    </span>
  )
}

export function Kbd({ cmd, shift, alt, ctrl, fn, mod, op, children }: KbdProps) {
  const platform = usePlatform()
  const opMap = useContext(KbdContext)

  if (op) {
    const entry = opMap[op] ?? defaultOpMap[op]
    if (!entry) return <kbd className={s.kbd}>{op}</kbd>

    if (platform === 'mac') return <kbd className={s.kbd}>{renderMacStr(entry.mac.mods, entry.mac.key)}</kbd>
    if (platform === 'win') return <kbd className={s.kbd}>{renderWinStr(entry.win.mods, entry.win.key)}</kbd>
    return renderBoth(entry.mac.mods, entry.win.mods, entry.mac.key)
  }

  const baseMods: ModKey[] = []
  if (fn)    baseMods.push('fn')
  if (ctrl)  baseMods.push('ctrl')
  if (alt)   baseMods.push('alt')
  if (shift) baseMods.push('shift')
  if (cmd)   baseMods.push('cmd')

  const key = children ?? ''

  if (mod) {
    const macMods: ModKey[] = [...baseMods, 'cmd']
    const winMods: ModKey[] = [...baseMods, 'ctrl']
    if (platform === 'mac') return <kbd className={s.kbd}>{renderMacStr(macMods, key)}</kbd>
    if (platform === 'win') return <kbd className={s.kbd}>{renderWinStr(winMods, key)}</kbd>
    return renderBoth(macMods, winMods, key)
  }

  // Explicit modifier props — default to Mac on SSR
  if (platform === 'win') return <kbd className={s.kbd}>{renderWinStr(baseMods, key)}</kbd>
  return <kbd className={s.kbd}>{renderMacStr(baseMods, key)}</kbd>
}
