import { useTheme } from '../hooks/useTheme'
import type { Theme } from '../hooks/useTheme'
import s from './ThemePicker.module.css'

const THEME_GROUPS: { label: string; themes: { id: Theme; label: string }[] }[] = [
  {
    label: 'Default Themes',
    themes: [
      { id: 'light', label: 'Light' },
      { id: 'dark', label: 'Dark' },
    ],
  },
  {
    label: 'Light Themes',
    themes: [
      { id: 'clouds', label: 'Clouds' },
      { id: 'disco', label: 'Disco' },
    ],
  },
  {
    label: 'Dark Themes',
    themes: [
      { id: 'neon', label: 'Neon' },
      { id: 'cyberpunk', label: 'Cyberpunk' },
      { id: 'college-dormitory', label: 'Dorm' },
    ],
  },
]

export function ThemePicker() {
  const [theme, setTheme] = useTheme()

  return (
    <div>
      {THEME_GROUPS.map((group) => (
        <div key={group.label} className={s.group}>
          <div className={s.groupLabel}>{group.label}</div>
          {group.themes.map(({ id, label }) => (
            <button
              key={id}
              onClick={() => setTheme(id)}
              className={`${s.themeItem}${theme === id ? ` ${s.themeItemActive}` : ''}`}
            >
              {label}
            </button>
          ))}
        </div>
      ))}
    </div>
  )
}
