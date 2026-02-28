import { MDXProvider } from '@mdx-js/react'
import { Exercise } from './components/Exercise'
import { ThemePicker } from './components/ThemePicker'
import { ThemeProvider } from './hooks/useTheme'
import Intro from './lessons/intro.mdx'

const components = { Exercise }

export default function App() {
  return (
    <ThemeProvider>
      <MDXProvider components={components}>
        <ThemePicker />
        <div className="lesson">
          <Intro />
        </div>
      </MDXProvider>
    </ThemeProvider>
  )
}
