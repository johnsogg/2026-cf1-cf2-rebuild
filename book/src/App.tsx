import { MDXProvider } from '@mdx-js/react'
import { Exercise, ExerciseNumberProvider } from 'immerse/components/Exercise'
import { GlossaryProvider, Term } from 'immerse/components/Glossary'
import { ThemePicker } from 'immerse/components/ThemePicker'
import { ThemeProvider } from 'immerse/hooks/useTheme'
import Intro from './units/01-variables-and-functions/chapters/01-basics/sections/01-intro.mdx'
import { glossaryEntries } from './glossary'

const components = { Exercise, Term }

export default function App() {
  return (
    <ThemeProvider>
      <GlossaryProvider entries={glossaryEntries}>
        <MDXProvider components={components}>
          <ThemePicker />
          <ExerciseNumberProvider>
            <div className="lesson">
              <Intro />
            </div>
          </ExerciseNumberProvider>
        </MDXProvider>
      </GlossaryProvider>
    </ThemeProvider>
  )
}
