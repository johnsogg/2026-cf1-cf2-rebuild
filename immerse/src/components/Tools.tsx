import { useEffect, useRef, useState } from "react"
import { IconButton } from "./IconButton"
import { ThemePicker } from "./ThemePicker"
import { UserMenu } from "./UserMenu"
import s from "./Tools.module.css"

type ActiveTool = "theme" | "user" | null

export const Tools = () => {
  const [activeTool, setActiveTool] = useState<ActiveTool>(null)
  const ref = useRef<HTMLDivElement>(null)

  const toggle = (tool: "theme" | "user") => {
    setActiveTool((prev) => (prev === tool ? null : tool))
  }

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setActiveTool(null)
      }
    }
    document.addEventListener("mousedown", handler)
    return () => document.removeEventListener("mousedown", handler)
  }, [])

  return (
    <div className={s.tools} ref={ref}>
      <div className={s.buttons}>
        <IconButton
          onClick={() => toggle("theme")}
          aria-label="Theme picker"
          active={activeTool === "theme"}
        >
          🎨
        </IconButton>
        <IconButton
          onClick={() => toggle("user")}
          aria-label="User menu"
          active={activeTool === "user"}
        >
          👤
        </IconButton>
      </div>
      {activeTool !== null && (
        <div className={s.panel}>
          {activeTool === "theme" && <ThemePicker />}
          {activeTool === "user" && <UserMenu />}
        </div>
      )}
    </div>
  )
}
