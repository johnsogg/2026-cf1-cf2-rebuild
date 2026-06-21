import { useEffect, useRef, useState } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { IconButton } from "./IconButton"
import { ThemePicker } from "./ThemePicker"
import { UserMenu } from "./UserMenu"
import { useNav } from "../nav/NavContext"
import { useProgress, getSectionStatus } from "../progress/ProgressContext"
import { getStorageValue } from "../storage"
import s from "./Tools.module.css"

type ActiveTool = "theme" | "user" | null

const CIRCUMFERENCE = 2 * Math.PI * 11

const ProgressRingIcon = ({ pct }: { pct: number }) => (
  <svg width="28" height="28" viewBox="0 0 28 28" aria-hidden="true">
    <circle cx="14" cy="14" r="11" fill="none" stroke="var(--border)" strokeWidth="3" />
    <circle
      cx="14"
      cy="14"
      r="11"
      fill="none"
      stroke="var(--success)"
      strokeWidth="3"
      strokeLinecap="round"
      strokeDasharray={CIRCUMFERENCE}
      strokeDashoffset={CIRCUMFERENCE * (1 - pct)}
      transform="rotate(-90 14 14)"
    />
  </svg>
)

export const Tools = ({ totalExercises }: { totalExercises?: number }) => {
  const [activeTool, setActiveTool] = useState<ActiveTool>(null)
  const ref = useRef<HTMLDivElement>(null)
  const navigate = useNavigate()
  const location = useLocation()
  const { tree } = useNav()
  const { version: _version } = useProgress()

  const allSections = tree.flatMap((u) => u.chapters.flatMap((c) => c.sections))
  const totalPages = allSections.length
  const readPages = allSections.filter(
    (s) => getSectionStatus(s.urlPath) === "complete",
  ).length

  const exerciseEntries = Object.values(getStorageValue((d) => d.exercises ?? {}))
  const attempted = exerciseEntries.filter(
    (e) => e.state === "attempted" || e.state === "complete",
  ).length
  const complete = exerciseEntries.filter((e) => e.state === "complete").length

  const readPct = totalPages > 0 ? Math.round((readPages / totalPages) * 100) : 0
  const attemptedPct = totalExercises ? Math.round((attempted / totalExercises) * 100) : null
  const completePct = totalExercises ? Math.round((complete / totalExercises) * 100) : null

  const isOverview = location.pathname === "/"

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
        <div className={s.progressWrapper}>
          <IconButton
            onClick={() => navigate("/")}
            aria-label="Overview"
            active={isOverview}
          >
            <ProgressRingIcon pct={readPages / Math.max(totalPages, 1)} />
          </IconButton>
          <div className={s.progressPopover}>
            <div>{readPct}% pages read</div>
            <div>{attemptedPct ?? "?"}% exercises attempted</div>
            <div>{completePct ?? "?"}% exercises complete</div>
          </div>
        </div>
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
