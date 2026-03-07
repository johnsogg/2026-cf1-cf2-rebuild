import { useEffect, useRef, useState } from 'react'
import Editor from '@monaco-editor/react'
import type { OnMount } from '@monaco-editor/react'
import ExecutorWorker from '../workers/executor.worker?worker'
import { useTheme } from '../hooks/useTheme'
import { registerMonacoThemes, monacoThemeName } from '../utils/monacoThemes'
import type { Monaco } from '@monaco-editor/react'
import s from './CodeExercise.module.css'
import btn from '../styles/buttons.module.css'

function handleBeforeMount(monaco: Monaco) {
  registerMonacoThemes(monaco)
}

export type CodeExerciseProps = {
  type: 'code'
  id: string
  title: string
  description?: string
  starterCode: string
  testCode: string
  moduleName: string
  hints?: string[]
}

type TestResult = {
  name: string
  passed: boolean
  error?: string
}

type WorkerResponse = {
  results: TestResult[]
  logs: string[]
  error?: string
}

export function CodeExercise({
  exercise,
  onAttempt,
  onComplete,
}: {
  exercise: CodeExerciseProps
  onAttempt?: () => void
  onComplete?: () => void
}) {
  const [appTheme] = useTheme()
  const monacoTheme = monacoThemeName(appTheme)
  const [code, setCode] = useState(exercise.starterCode)
  const [results, setResults] = useState<TestResult[]>([])
  const [logs, setLogs] = useState<string[]>([])
  const [running, setRunning] = useState(false)
  const [timedOut, setTimedOut] = useState(false)
  const [error, setError] = useState<string | undefined>()
  const maxEditorHeight = Math.floor(window.innerHeight * 0.75)
  const [editorHeight, setEditorHeight] = useState(300)
  const editorRef = useRef<Parameters<OnMount>[0] | null>(null)

  const handleEditorMount: OnMount = (editor) => {
    editorRef.current = editor
    const updateHeight = () => {
      const h = Math.min(editor.getContentHeight(), maxEditorHeight)
      setEditorHeight(h)
    }
    updateHeight()
    editor.onDidContentSizeChange(updateHeight)
  }

  useEffect(() => {
    const editor = editorRef.current
    if (editor) {
      editor.layout({ height: editorHeight, width: editor.getLayoutInfo().width })
    }
  }, [editorHeight])

  useEffect(() => {
    if (results.length > 0) {
      if (results.every((r) => r.passed)) {
        onComplete?.()
      } else {
        onAttempt?.()
      }
    }
  }, [results, onComplete, onAttempt])

  if (window.innerWidth < 640) {
    return <p>This exercise requires a computer or tablet.</p>
  }

  const handleRun = () => {
    if (running) return
    setRunning(true)
    setTimedOut(false)
    setResults([])
    setLogs([])
    setError(undefined)

    const worker = new ExecutorWorker()

    const timeout = setTimeout(() => {
      worker.terminate()
      setTimedOut(true)
      setRunning(false)
    }, 5000)

    worker.onmessage = (e: MessageEvent<WorkerResponse>) => {
      clearTimeout(timeout)
      worker.terminate()
      setResults(e.data.results)
      setLogs(e.data.logs)
      setError(e.data.error)
      setRunning(false)
    }

    worker.postMessage({
      studentCode: code,
      testCode: exercise.testCode,
      moduleName: exercise.moduleName,
    })
  }

  return (
    <>
      {exercise.description && (
        <p className={s.description}>{exercise.description}</p>
      )}

      <div className={s.editorWrap}>
        <Editor
          height={editorHeight}
          defaultLanguage="typescript"
          value={code}
          onChange={(val) => setCode(val ?? '')}
          onMount={handleEditorMount}
          beforeMount={handleBeforeMount}
          theme={monacoTheme}
          options={{
            scrollBeyondLastLine: false,
            minimap: { enabled: false },
            fontSize: 14,
          }}
        />
      </div>

      <details className={s.testDetails}>
        <summary>View test code</summary>
        <pre className={s.testCode}>{exercise.testCode}</pre>
      </details>

      <div className={s.actions}>
        <button className={btn.btnPrimary} onClick={handleRun} disabled={running}>
          Run
        </button>
        {running && <span style={{ color: 'var(--text-muted)' }}>Running...</span>}
      </div>

      {timedOut && (
        <div className={`${s.alert} ${s.alertWarning}`}>
          Execution timed out — possible infinite loop. The worker was terminated after 5 seconds.
        </div>
      )}

      {error && (
        <div className={`${s.alert} ${s.alertError}`}>
          <strong>Error:</strong> {error}
        </div>
      )}

      {results.length > 0 && (
        <div className={s.testResults}>
          <h4 style={{ marginBottom: 8 }}>Results</h4>
          {results.map((r) => (
            <div
              key={r.name}
              className={`${s.result} ${r.passed ? s.resultPass : s.resultFail}`}
            >
              <span style={{ marginRight: 8 }}>{r.passed ? '✓' : '✗'}</span>
              <strong>{r.name}</strong>
              {!r.passed && r.error && (
                <div className={s.resultError}>{r.error}</div>
              )}
            </div>
          ))}
        </div>
      )}

      {logs.length > 0 && (
        <div>
          <h4 style={{ marginBottom: 8 }}>Console output</h4>
          <pre className={s.console}>{logs.join('\n')}</pre>
        </div>
      )}
    </>
  )
}
