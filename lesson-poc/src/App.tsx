import { MDXProvider } from '@mdx-js/react'
import { Exercise, ExerciseNumberProvider } from './components/Exercise'
import { ThemePicker } from './components/ThemePicker'
import { ThemeProvider } from './hooks/useTheme'
import Intro from './lessons/intro.mdx'

const components = { Exercise }

export default function App() {
  return (
    <ThemeProvider>
      <MDXProvider components={components}>
        <ThemePicker />
        <ExerciseNumberProvider>
          <div className="lesson">
            <Intro />
          </div>
        </ExerciseNumberProvider>
      </MDXProvider>
    </ThemeProvider>
  )
}
