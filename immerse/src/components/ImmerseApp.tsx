import { MDXProvider } from "@mdx-js/react"
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ComponentType,
} from "react"
import { BrowserRouter, Link, useLocation } from "react-router-dom"
import { Exercise, ExerciseNumberProvider } from "./Exercise"
import {
  GlossaryProvider,
  GlossaryView,
  Term,
  type GlossaryEntry,
} from "./Glossary"
import { ThemeProvider } from "../hooks/useTheme"
import { Tools } from "./Tools"
import { NavProvider, useNav } from "../nav/NavContext"
import { ProgressProvider, useProgress, getSectionStatus } from "../progress/ProgressContext"
import s from "./ImmerseApp.module.css"
import { TableOfContents } from "./nav/TableOfContents"
import { NavBar } from "./nav/Nav"
import { initStorage, getStorageValue, setStorageValue } from "../storage"

export type ImmerseAppProps = {
  bookSlug: string
  titles: Record<string, string>
  loaders: Record<string, () => Promise<{ default: ComponentType }>>
  glossaryEntries: GlossaryEntry[]
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  components?: Record<string, ComponentType<any>>
  overview?: ComponentType
  totalExercises?: number
}

const CurrentSection = ({ onLoaded }: { onLoaded: () => void }) => {
  const { currentSection } = useNav()
  const [Component, setComponent] = useState<ComponentType | null>(null)

  useEffect(() => {
    setComponent(null)
    currentSection.load().then((mod) => setComponent(() => mod.default))
  }, [currentSection])

  useEffect(() => {
    if (Component) onLoaded()
  }, [Component]) // eslint-disable-line react-hooks/exhaustive-deps

  if (!Component) return <p>Loading…</p>
  return <Component />
}

const Overview = ({
  overview: OverviewContent,
  totalExercises,
}: {
  overview?: ComponentType
  totalExercises?: number
}) => {
  const { tree } = useNav()
  const { version } = useProgress() // eslint-disable-line @typescript-eslint/no-unused-vars

  const allSections = tree.flatMap((u) => u.chapters.flatMap((c) => c.sections))
  const totalPages = allSections.length
  const readPages = allSections.filter(
    (s) => getSectionStatus(s.urlPath) === "complete",
  ).length

  const exerciseEntries = Object.values(
    getStorageValue((d) => d.exercises ?? {}),
  )
  const attempted = exerciseEntries.filter(
    (e) => e.state === "attempted" || e.state === "complete",
  ).length
  const complete = exerciseEntries.filter((e) => e.state === "complete").length

  const lastPath = getStorageValue((d) => d.nav?.lastSection)
  const found = lastPath
    ? allSections.find((s) => s.urlPath === lastPath)
    : undefined
  const section = found ?? allSections[0]
  const isResume = !!found

  const readPct = totalPages > 0 ? Math.round((readPages / totalPages) * 100) : 0
  const attemptedPct = totalExercises
    ? Math.round((attempted / totalExercises) * 100)
    : null
  const completePct = totalExercises
    ? Math.round((complete / totalExercises) * 100)
    : null

  return (
    <div className={s.lesson}>
      {OverviewContent && <OverviewContent />}
      <div className={s.progress}>
        <h2>Your progress</h2>
        <ul>
          <li>
            {readPages} of {totalPages} pages read ({readPct}%)
          </li>
          <li>
            Exercises: {attempted} attempted ({attemptedPct ?? "?"}%),{" "}
            {complete} complete ({completePct ?? "?"}%)
            {totalExercises ? ` of ${totalExercises}` : ""}
          </li>
          {isResume && (
            <li>
              Last visited: <Link to={section.urlPath}>{section.title}</Link>
            </li>
          )}
        </ul>
      </div>
      <p>
        {isResume ? "Ready to pick up where you left off?" : "Get started:"}{" "}
        <Link to={section.urlPath}>{section.title}</Link>
      </p>
    </div>
  )
}

const defaultComponents = { Exercise, Term }

const AppLayout = ({
  overview,
  totalExercises,
}: {
  overview?: ComponentType
  totalExercises?: number
}) => {
  const { currentSection } = useNav()
  const { notifyExerciseChange } = useProgress()
  const location = useLocation()
  const contentAreaRef = useRef<HTMLDivElement>(null)
  const scrollPositions = useRef<Map<string, number>>(new Map())
  const currentPathRef = useRef(currentSection.urlPath)
  currentPathRef.current = currentSection.urlPath

  const isRoot = location.pathname === "/"
  const isGlossary = location.pathname === "/glossary"

  // Persist last visited section (not when at root or glossary)
  useEffect(() => {
    if (!isRoot && !isGlossary) {
      setStorageValue((d) => {
        ;(d.nav ??= {}).lastSection = currentSection.urlPath
      })
    }
  }, [currentSection.urlPath, isRoot, isGlossary])

  useEffect(() => {
    if (isRoot || isGlossary) return
    const el = contentAreaRef.current
    if (!el) return
    const urlPath = currentSection.urlPath
    const handleScroll = () => {
      scrollPositions.current.set(urlPath, el.scrollTop)
      const scrollDepth = el.scrollTop / (el.scrollHeight - el.clientHeight)
      if (
        scrollDepth >= 0.9 &&
        !getStorageValue((d) => d.sections?.[urlPath]?.read)
      ) {
        setStorageValue((d) => {
          ;((d.sections ??= {})[urlPath] ??= {}).read = true
        })
        notifyExerciseChange()
      }
    }
    el.addEventListener("scroll", handleScroll, { passive: true })
    return () => el.removeEventListener("scroll", handleScroll)
  }, [currentSection.urlPath, notifyExerciseChange, isRoot, isGlossary])

  const handleSectionLoaded = useCallback(() => {
    const el = contentAreaRef.current
    if (!el) return
    el.scrollTop = scrollPositions.current.get(currentPathRef.current) ?? 0
    // Auto-mark short sections (no scrollable content) as read
    if (el.scrollHeight <= el.clientHeight) {
      const urlPath = currentPathRef.current
      if (!getStorageValue((d) => d.sections?.[urlPath]?.read)) {
        setStorageValue((d) => {
          ;((d.sections ??= {})[urlPath] ??= {}).read = true
        })
        notifyExerciseChange()
      }
    }
  }, [notifyExerciseChange])

  return (
    <div className={s.layout}>
      <Tools totalExercises={totalExercises} />
      <TableOfContents />
      <div ref={contentAreaRef} className={s.contentArea}>
        {isRoot ? (
          <Overview overview={overview} totalExercises={totalExercises} />
        ) : isGlossary ? (
          <div className={s.lesson}>
            <GlossaryView />
          </div>
        ) : (
          <ExerciseNumberProvider>
            <div className={s.lesson}>
              <CurrentSection onLoaded={handleSectionLoaded} />
              <NavBar />
            </div>
          </ExerciseNumberProvider>
        )}
      </div>
    </div>
  )
}

export const ImmerseApp = ({
  bookSlug,
  titles,
  loaders,
  glossaryEntries,
  components,
  overview,
  totalExercises,
}: ImmerseAppProps) => {
  initStorage(bookSlug)
  const mdxComponents = { ...defaultComponents, ...components }
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <ThemeProvider>
        <GlossaryProvider entries={glossaryEntries}>
          <MDXProvider components={mdxComponents}>
            <NavProvider titles={titles} loaders={loaders}>
              <ProgressProvider>
                <AppLayout overview={overview} totalExercises={totalExercises} />
              </ProgressProvider>
            </NavProvider>
          </MDXProvider>
        </GlossaryProvider>
      </ThemeProvider>
    </BrowserRouter>
  )
}
