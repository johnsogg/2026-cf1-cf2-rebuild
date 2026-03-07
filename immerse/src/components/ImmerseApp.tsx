import { MDXProvider } from '@mdx-js/react'
import { useEffect, useState, type ComponentType } from 'react'
import { BrowserRouter } from 'react-router-dom'
import { Exercise, ExerciseNumberProvider } from './Exercise'
import { GlossaryProvider, Term, type GlossaryEntry } from './Glossary'
import { ThemeProvider } from '../hooks/useTheme'
import { Tools } from './Tools'
import { NavProvider, useNav } from '../nav/NavContext'
import s from './ImmerseApp.module.css'
import { TableOfContents } from './nav/TableOfContents'

export type ImmersAppProps = {
  titles: Record<string, string>
  loaders: Record<string, () => Promise<{ default: ComponentType }>>
  glossaryEntries: GlossaryEntry[]
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  components?: Record<string, ComponentType<any>>
}

const CurrentSection = () => {
  const { currentSection } = useNav()
  const [Component, setComponent] = useState<ComponentType | null>(null)

  useEffect(() => {
    setComponent(null)
    currentSection.load().then((mod) => setComponent(() => mod.default))
  }, [currentSection])

  if (!Component) return <p>Loading…</p>
  return <Component />
}

const defaultComponents = { Exercise, Term }

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
              <div className={s.layout}>
                <Tools />
                <TableOfContents />
                <ExerciseNumberProvider>
                  <div className={s.lesson}>
                    <CurrentSection />
                  </div>
                </ExerciseNumberProvider>
              </div>
            </NavProvider>
          </MDXProvider>
        </GlossaryProvider>
      </ThemeProvider>
    </BrowserRouter>
  )
}

