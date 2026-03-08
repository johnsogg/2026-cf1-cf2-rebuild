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
import { ProgressProvider, useProgress } from "../progress/ProgressContext"
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

const OrientationView = () => {
  const { tree } = useNav()
  const flat = tree.flatMap((u) => u.chapters.flatMap((c) => c.sections))
  const lastPath = getStorageValue((d) => d.nav?.lastSection)
  const found = lastPath ? flat.find((s) => s.urlPath === lastPath) : undefined
  const section = found ?? flat[0]
  const isResume = !!found

  return (
    <div className={s.lesson}>
      <p>
        {isResume ? "Ready to pick up where you left off?" : "Get started:"}{" "}
        <Link to={section.urlPath}>{section.title}</Link>
      </p>
    </div>
  )
}

const defaultComponents = { Exercise, Term }

const AppLayout = () => {
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
      <Tools />
      <TableOfContents />
      <div ref={contentAreaRef} className={s.contentArea}>
        {isRoot ? (
          <OrientationView />
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
}: ImmerseAppProps) => {
  initStorage(bookSlug)
  const mdxComponents = { ...defaultComponents, ...components }
  return (
    <BrowserRouter>
      <ThemeProvider>
        <GlossaryProvider entries={glossaryEntries}>
          <MDXProvider components={mdxComponents}>
            <NavProvider titles={titles} loaders={loaders}>
              <ProgressProvider>
                <AppLayout />
              </ProgressProvider>
            </NavProvider>
          </MDXProvider>
        </GlossaryProvider>
      </ThemeProvider>
    </BrowserRouter>
  )
}
