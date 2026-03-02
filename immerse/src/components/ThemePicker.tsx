import { useTheme } from '../hooks/useTheme'
import type { Theme } from '../hooks/useTheme'

const THEMES: { id: Theme; label: string }[] = [
  { id: 'light', label: 'Light' },
  { id: 'dark', label: 'Dark' },
  { id: 'neon', label: 'Neon' },
  { id: 'cyberpunk', label: 'Cyberpunk' },
  { id: 'college-dormitory', label: 'Dorm' },
]

export function ThemePicker() {
  const [theme, setTheme] = useTheme()

  return (
    <div style={{
      position: 'fixed',
      top: 16,
      right: 16,
      display: 'flex',
      gap: 6,
      background: 'var(--bg)',
      border: '1px solid var(--border)',
      borderRadius: 8,
      padding: '6px 8px',
      zIndex: 1000,
      boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
    }}>
      {THEMES.map(({ id, label }) => (
        <button
          key={id}
          onClick={() => setTheme(id)}
          style={{
            padding: '4px 10px',
            fontSize: 13,
            cursor: 'pointer',
            borderRadius: 4,
            border: theme === id ? '1.5px solid var(--accent)' : '1.5px solid var(--border)',
            background: theme === id ? 'var(--accent)' : 'transparent',
            color: theme === id ? 'var(--accent-text)' : 'var(--text-muted)',
            fontWeight: theme === id ? 600 : 400,
            transition: 'all 0.15s',
          }}
        >
          {label}
        </button>
      ))}
    </div>
  )
}
