import { useEffect, useRef, useState } from 'react'
import Editor from '@monaco-editor/react'
import type { OnMount } from '@monaco-editor/react'
import ExecutorWorker from '../workers/executor.worker?worker'
import { useTheme } from '../hooks/useTheme'
import { registerMonacoThemes, monacoThemeName } from '../utils/monacoThemes'
import type { Monaco } from '@monaco-editor/react'

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
  hints?: Record<string, string>
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

export function CodeExercise({ exercise }: { exercise: CodeExerciseProps }) {
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

  const handleReset = () => {
    setCode(exercise.starterCode)
    setResults([])
    setLogs([])
    setError(undefined)
    setTimedOut(false)
  }

  return (
    <div style={{ border: '1px solid var(--border)', borderRadius: 6, padding: 20, marginBottom: 24 }}>
      <h3 style={{ marginTop: 0, marginBottom: 8 }}>{exercise.title}</h3>
      {exercise.description && (
        <p style={{ marginBottom: 16, whiteSpace: 'pre-line', color: 'var(--text-muted)' }}>
          {exercise.description}
        </p>
      )}

      <div style={{ border: '1px solid var(--border)', borderRadius: 4, overflow: 'hidden', marginBottom: 12 }}>
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

      <details style={{ marginBottom: 12, fontSize: 13, color: 'var(--text-muted)' }}>
        <summary style={{ cursor: 'pointer' }}>View test code</summary>
        <pre style={{
          background: 'var(--code-bg)',
          padding: '10px 14px',
          borderRadius: 4,
          overflowX: 'auto',
          marginTop: 8,
          fontSize: 12,
        }}>
          {exercise.testCode}
        </pre>
      </details>

      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
        <button
          onClick={handleRun}
          disabled={running}
          style={{
            padding: '8px 20px',
            fontSize: 15,
            cursor: running ? 'not-allowed' : 'pointer',
            background: running ? 'var(--text-muted)' : 'var(--accent)',
            color: 'var(--accent-text)',
            border: 'none',
            borderRadius: 4,
          }}
        >
          Run
        </button>
        <button
          onClick={handleReset}
          style={{
            padding: '8px 20px',
            fontSize: 15,
            cursor: 'pointer',
            background: 'transparent',
            color: 'var(--text-muted)',
            border: '1px solid var(--border)',
            borderRadius: 4,
          }}
        >
          Reset
        </button>
        {running && <span style={{ color: 'var(--text-muted)' }}>Running...</span>}
      </div>

      {timedOut && (
        <div style={{ background: 'var(--warning-bg)', border: '1px solid var(--warning)', borderRadius: 4, padding: '10px 14px', marginBottom: 12 }}>
          Execution timed out — possible infinite loop. The worker was terminated after 5 seconds.
        </div>
      )}

      {error && (
        <div style={{ background: 'var(--error-bg)', border: '1px solid var(--error)', borderRadius: 4, padding: '10px 14px', marginBottom: 12, fontFamily: 'monospace', whiteSpace: 'pre-wrap' }}>
          <strong>Error:</strong> {error}
        </div>
      )}

      {results.length > 0 && (
        <div style={{ marginBottom: 16 }}>
          <h4 style={{ marginBottom: 8 }}>Results</h4>
          {results.map((r) => (
            <div key={r.name}>
              <div
                style={{
                  padding: '8px 12px',
                  marginBottom: 4,
                  borderRadius: 4,
                  background: r.passed ? 'var(--success-bg)' : 'var(--error-bg)',
                  border: `1px solid ${r.passed ? 'var(--success)' : 'var(--error)'}`,
                }}
              >
                <span style={{ marginRight: 8 }}>{r.passed ? '✓' : '✗'}</span>
                <strong>{r.name}</strong>
                {!r.passed && r.error && (
                  <div style={{ marginTop: 4, fontFamily: 'monospace', fontSize: 13, color: 'var(--error)' }}>
                    {r.error}
                  </div>
                )}
              </div>
              {!r.passed && exercise.hints?.[r.name] && (
                <div style={{
                  padding: '8px 12px',
                  marginBottom: 8,
                  borderRadius: 4,
                  background: 'var(--warning-bg)',
                  border: '1px solid var(--warning)',
                  fontSize: 13,
                }}>
                  <strong>Hint:</strong> {exercise.hints[r.name]}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {logs.length > 0 && (
        <div>
          <h4 style={{ marginBottom: 8 }}>Console output</h4>
          <pre style={{
            background: 'var(--console-bg)',
            color: 'var(--console-text)',
            padding: '12px 16px',
            borderRadius: 4,
            fontFamily: 'monospace',
            fontSize: 13,
            overflowX: 'auto',
            margin: 0,
          }}>
            {logs.join('\n')}
          </pre>
        </div>
      )}
    </div>
  )
}
