import { MDXProvider } from '@mdx-js/react'
import { Exercise, ExerciseNumberProvider } from 'immerse/components/Exercise'
import { GlossaryProvider, Term } from 'immerse/components/Glossary'
import { ThemePicker } from 'immerse/components/ThemePicker'
import { ThemeProvider } from 'immerse/hooks/useTheme'
import { useEffect, useState, type ComponentType } from 'react'
import { BrowserRouter } from 'react-router-dom'
import { NavBar, TableOfContents } from './Nav'
import { NavProvider, useNav } from './NavContext'
import { glossaryEntries } from './glossary'

const components = { Exercise, Term }

function CurrentSection() {
  const { currentSection } = useNav()
  const [Component, setComponent] = useState<ComponentType | null>(null)

  useEffect(() => {
    setComponent(null)
    currentSection.load().then(mod => setComponent(() => mod.default))
  }, [currentSection])

  if (!Component) return <p>Loading…</p>
  return <Component />
}

export default function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <GlossaryProvider entries={glossaryEntries}>
          <MDXProvider components={components}>
            <NavProvider>
              <ThemePicker />
              <TableOfContents />
              <ExerciseNumberProvider>
                <div className="lesson">
                  <CurrentSection />
                </div>
              </ExerciseNumberProvider>
              <NavBar />
            </NavProvider>
          </MDXProvider>
        </GlossaryProvider>
      </ThemeProvider>
    </BrowserRouter>
  )
}
