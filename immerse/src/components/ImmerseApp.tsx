import { MDXProvider } from '@mdx-js/react'
import { useCallback, useEffect, useRef, useState, type ComponentType } from 'react'
import { BrowserRouter } from 'react-router-dom'
import { Exercise, ExerciseNumberProvider } from './Exercise'
import { GlossaryProvider, Term, type GlossaryEntry } from './Glossary'
import { ThemeProvider } from '../hooks/useTheme'
import { Tools } from './Tools'
import { NavProvider, useNav } from '../nav/NavContext'
import s from './ImmerseApp.module.css'
import { TableOfContents } from './nav/TableOfContents'
import { NavBar } from './nav/Nav'

export type ImmersAppProps = {
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

const defaultComponents = { Exercise, Term }

const AppLayout = () => {
  const { currentSection } = useNav()
  const contentAreaRef = useRef<HTMLDivElement>(null)
  const scrollPositions = useRef<Map<string, number>>(new Map())
  const currentPathRef = useRef(currentSection.urlPath)
  currentPathRef.current = currentSection.urlPath

  useEffect(() => {
    const el = contentAreaRef.current
    if (!el) return
    const handleScroll = () => {
      scrollPositions.current.set(currentSection.urlPath, el.scrollTop)
    }
    el.addEventListener('scroll', handleScroll, { passive: true })
    return () => el.removeEventListener('scroll', handleScroll)
  }, [currentSection.urlPath])

  const handleSectionLoaded = useCallback(() => {
    const el = contentAreaRef.current
    if (!el) return
    el.scrollTop = scrollPositions.current.get(currentPathRef.current) ?? 0
  }, [])

  return (
    <div className={s.layout}>
      <Tools />
      <TableOfContents />
      <div ref={contentAreaRef} className={s.contentArea}>
        <ExerciseNumberProvider>
          <div className={s.lesson}>
            <CurrentSection onLoaded={handleSectionLoaded} />
            <NavBar />
          </div>
        </ExerciseNumberProvider>
      </div>
    </div>
  )
}

export const ImmersApp = ({
  titles,
  loaders,
  glossaryEntries,
  components,
}: ImmersAppProps) => {
  const mdxComponents = { ...defaultComponents, ...components }
  return (
    <BrowserRouter>
      <ThemeProvider>
        <GlossaryProvider entries={glossaryEntries}>
          <MDXProvider components={mdxComponents}>
            <NavProvider titles={titles} loaders={loaders}>
              <AppLayout />
            </NavProvider>
          </MDXProvider>
        </GlossaryProvider>
      </ThemeProvider>
    </BrowserRouter>
  )
}
