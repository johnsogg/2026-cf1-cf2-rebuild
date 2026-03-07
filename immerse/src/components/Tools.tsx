import { useEffect, useRef, useState } from 'react'
import { ThemePicker } from './ThemePicker'
import { UserMenu } from './UserMenu'
import s from './Tools.module.css'

type ActiveTool = 'theme' | 'user' | null

export const Tools = () => {
  const [activeTool, setActiveTool] = useState<ActiveTool>(null)
  const ref = useRef<HTMLDivElement>(null)

  const toggle = (tool: 'theme' | 'user') => {
    setActiveTool((prev) => (prev === tool ? null : tool))
  }

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setActiveTool(null)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  return (
    <div className={s.tools} ref={ref}>
      <div className={s.buttons}>
        <button
          className={`${s.iconButton}${activeTool === 'theme' ? ` ${s.iconButtonActive}` : ''}`}
          onClick={() => toggle('theme')}
          aria-label="Theme picker"
        >
          🎨
        </button>
        <button
          className={`${s.iconButton}${activeTool === 'user' ? ` ${s.iconButtonActive}` : ''}`}
          onClick={() => toggle('user')}
          aria-label="User menu"
        >
          👤
        </button>
      </div>
      {activeTool !== null && (
        <div className={s.panel}>
          {activeTool === 'theme' && <ThemePicker />}
          {activeTool === 'user' && <UserMenu />}
        </div>
      )}
    </div>
  )
}
