import { MDXProvider } from "@mdx-js/react"
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ComponentType,
} from "react"
import { BrowserRouter, Link, useLocation } from "react-router-dom"
import { Ask, AskProvider } from "./Ask"
import { Solution } from "./Solution"
import { CodeExercise } from "./CodeExercise"
import { MultipleChoiceExercise } from "./MultipleChoiceExercise"
import { P5Exercise } from "./P5Exercise"
import { ConsoleExercise } from "./ConsoleExercise"
import {
  GlossaryProvider,
  GlossaryView,
  Term,
  type GlossaryEntry,
} from "./Glossary"
import { ThemeProvider } from "../hooks/useTheme"
import { Tools } from "./Tools"
import { NavProvider, useNav } from "../nav/NavContext"
import type { MiscPage } from "../nav/navTree"
import {
  ProgressProvider,
  useProgress,
  getSectionStatus,
} from "../progress/ProgressContext"
import s from "./ImmerseApp.module.css"
import { TableOfContents } from "./nav/TableOfContents"
import { NavBar } from "./nav/Nav"
import { initStorage, getStorageValue, setStorageValue } from "../storage"
import { Kbd, KbdProvider } from "./Kbd"
import { ExpectedReadTime } from "./ExpectedReadTime"

export type ImmerseAppProps = {
  bookSlug: string
  titles: Record<string, string>
  loaders: Record<string, () => Promise<{ default: ComponentType }>>
  glossaryEntries: GlossaryEntry[]
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  components?: Record<string, ComponentType<any>>
  overview?: ComponentType
  totalExercises?: number
  misc?: MiscPage[]
}

const MiscPageView = ({ page }: { page: MiscPage }) => {
  const [Component, setComponent] = useState<ComponentType | null>(null)
  useEffect(() => {
    setComponent(null)
    page.load().then((mod) => setComponent(() => mod.default))
  }, [page])
  if (!Component) return <p>Loading…</p>
  return <Component />
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
  const { version: _version } = useProgress()

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

  const readPct =
    totalPages > 0 ? Math.round((readPages / totalPages) * 100) : 0
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

const defaultComponents = {
  Ask,
  Solution,
  CodeExercise,
  MultipleChoiceExercise,
  P5Exercise,
  ConsoleExercise,
  Term,
  ExpectedReadTime,
  Kbd,
  KbdProvider,
}

const AppLayout = ({
  overview,
  totalExercises,
  misc,
}: {
  overview?: ComponentType
  totalExercises?: number
  misc?: MiscPage[]
}) => {
  const { currentSection } = useNav()
  const { notifyExerciseChange } = useProgress()
  const location = useLocation()
  const contentAreaRef = useRef<HTMLDivElement>(null)
  const scrollPositions = useRef<Map<string, number>>(new Map())
  const currentPathRef = useRef(currentSection.urlPath)
  currentPathRef.current = currentSection.urlPath
  const lastHashRef = useRef<string | null>(null)

  const isRoot = location.pathname === "/"
  const isGlossary = location.pathname === "/glossary"
  const currentMiscPage = misc?.find((m) => m.urlPath === location.pathname)
  const isMisc = !!currentMiscPage

  // Persist last visited section (not when at root, glossary, or misc)
  useEffect(() => {
    if (!isRoot && !isGlossary && !isMisc) {
      setStorageValue((d) => {
        ;(d.nav ??= {}).lastSection = currentSection.urlPath
      })
    }
  }, [currentSection.urlPath, isRoot, isGlossary])

  useEffect(() => {
    if (isRoot || isGlossary || isMisc) return
    const el = contentAreaRef.current
    if (!el) return
    const urlPath = currentSection.urlPath
    lastHashRef.current = window.location.hash.slice(1) || null
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

      // Scrollspy: keep the URL fragment pointed at whichever heading is
      // currently at the top of the content area. This uses raw history
      // (not react-router navigation) so it doesn't trigger a re-render or
      // add history entries — its only job is making sure a dev-server full
      // reload on save lands back where you were instead of at the top.
      const headings = el.querySelectorAll<HTMLElement>("h2[id], h3[id]")
      const containerTop = el.getBoundingClientRect().top
      let current: string | null = null
      for (const heading of headings) {
        if (heading.getBoundingClientRect().top - containerTop <= 96) {
          current = heading.id
        } else {
          break
        }
      }
      if (current !== lastHashRef.current) {
        lastHashRef.current = current
        const url = `${window.location.pathname}${window.location.search}${current ? `#${current}` : ""}`
        window.history.replaceState(null, "", url)
      }
    }
    el.addEventListener("scroll", handleScroll, { passive: true })
    return () => el.removeEventListener("scroll", handleScroll)
  }, [currentSection.urlPath, notifyExerciseChange, isRoot, isGlossary])

  const handleSectionLoaded = useCallback(() => {
    const el = contentAreaRef.current
    if (!el) return
    const hash = window.location.hash.slice(1)
    const target = hash
      ? el.querySelector<HTMLElement>(`#${CSS.escape(hash)}`)
      : null
    if (target) {
      target.scrollIntoView({ block: "start" })
    } else {
      el.scrollTop = scrollPositions.current.get(currentPathRef.current) ?? 0
    }
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
      <div ref={contentAreaRef} className={s.contentArea} data-content-area>
        {isRoot ? (
          <Overview overview={overview} totalExercises={totalExercises} />
        ) : isGlossary ? (
          <div className={s.lesson}>
            <GlossaryView />
          </div>
        ) : isMisc ? (
          <AskProvider>
            <div className={s.lesson}>
              <MiscPageView page={currentMiscPage!} />
            </div>
          </AskProvider>
        ) : (
          <AskProvider>
            <div className={s.lesson}>
              <CurrentSection onLoaded={handleSectionLoaded} />
              <NavBar />
            </div>
          </AskProvider>
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
  misc = [],
}: ImmerseAppProps) => {
  initStorage(bookSlug)
  const mdxComponents = { ...defaultComponents, ...components }
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <ThemeProvider>
        <GlossaryProvider entries={glossaryEntries}>
          <MDXProvider components={mdxComponents}>
            <NavProvider titles={titles} loaders={loaders} misc={misc}>
              <ProgressProvider>
                <AppLayout
                  overview={overview}
                  totalExercises={totalExercises}
                  misc={misc}
                />
              </ProgressProvider>
            </NavProvider>
          </MDXProvider>
        </GlossaryProvider>
      </ThemeProvider>
    </BrowserRouter>
  )
}
