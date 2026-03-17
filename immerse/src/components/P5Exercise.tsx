import { useRef, useState, useCallback, useEffect } from "react"
import Editor, { type BeforeMount, type OnMount } from "@monaco-editor/react"
import p5Source from "p5/lib/p5.min.js?raw"
import { useTheme } from "../hooks/useTheme"
import { registerMonacoThemes, monacoThemeName } from "../utils/monacoThemes"
import { IconButton } from "./IconButton"
import { SvgIcon } from "./SvgIcon"
import s from "./P5Exercise.module.css"

// Eagerly load all @types/p5 declaration files so Monaco gets p5 global types.
// Path goes up from immerse/src/components/ to the monorepo root node_modules.
const p5TypeFiles = import.meta.glob<string>(
  "../../../node_modules/@types/p5/**/*.d.ts",
  { query: "?raw", import: "default", eager: true },
)

const beforeMount: BeforeMount = (monaco) => {
  registerMonacoThemes(monaco)
  for (const [path, content] of Object.entries(p5TypeFiles)) {
    // Normalize relative key to a virtual absolute path Monaco can cross-reference
    const virtualPath = path.replace("../../../node_modules", "/node_modules")
    monaco.languages.typescript.typescriptDefaults.addExtraLib(
      content,
      `file://${virtualPath}`,
    )
  }
}

export type P5ExerciseProps = {
  type: "p5"
  id: string
  title?: string
  initialCode: string
  hints?: string[]
  size?: "small" | "medium" | "large"
}

type TranspilerResponse = {
  js?: string
  error?: string
}

// The iframe srcdoc: inlines p5, runs student JS, and reports runtime errors to the parent.
function buildSrcdoc(studentJS: string): string {
  return `<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <style>
      body { margin: 0; overflow: hidden; }
      canvas { display: block; }
    </style>
  </head>
  <body>
    <script>${p5Source}<\/script>
    <script>
      window.onerror = function(msg, _src, _line, _col, err) {
        parent.postMessage({ type: 'sketch-error', message: err ? err.message : String(msg) }, '*');
      };
      try {
        ${studentJS}
      } catch (e) {
        parent.postMessage({ type: 'sketch-error', message: e instanceof Error ? e.message : String(e) }, '*');
      }
    <\/script>
  </body>
</html>`
}

export function P5Exercise({
  exercise,
}: {
  exercise: P5ExerciseProps
  onAttempt?: () => void
  onComplete?: () => void
}) {
  const { initialCode } = exercise
  const height = { small: "200px", medium: "400px", large: "80vh" }[exercise.size ?? "medium"]
  const [code, setCode] = useState(initialCode)
  const [srcdoc, setSrcdoc] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [running, setRunning] = useState(false)
  const workerRef = useRef<Worker | null>(null)
  const [appTheme] = useTheme()
  const monacoTheme = monacoThemeName(appTheme)

  useEffect(() => {
    const handler = (e: MessageEvent<{ type: string; message: string }>) => {
      if (e.data?.type === "sketch-error") {
        setError(e.data.message)
        setRunning(false)
        setSrcdoc(null)
      }
    }
    window.addEventListener("message", handler)
    return () => window.removeEventListener("message", handler)
  }, [])

  const stopSketch = useCallback(() => {
    setSrcdoc(null)
    setRunning(false)
    if (workerRef.current) {
      workerRef.current.terminate()
      workerRef.current = null
    }
  }, [])

  const runSketch = useCallback(() => {
    setError(null)
    stopSketch()

    const worker = new Worker(
      new URL("../workers/p5-transpiler.worker.ts", import.meta.url),
      { type: "module" },
    )
    workerRef.current = worker

    worker.onmessage = (e: MessageEvent<TranspilerResponse>) => {
      worker.terminate()
      workerRef.current = null

      const { js, error: transpileError } = e.data
      if (transpileError) {
        setError(transpileError)
        setRunning(false)
        return
      }

      setSrcdoc(buildSrcdoc(js ?? ""))
      setRunning(true)
    }

    worker.onerror = (e) => {
      setError(e.message)
      setRunning(false)
      worker.terminate()
      workerRef.current = null
    }

    worker.postMessage({ code })
  }, [code, stopSketch])

  const runSketchRef = useRef(runSketch)
  const stopSketchRef = useRef(stopSketch)
  useEffect(() => { runSketchRef.current = runSketch }, [runSketch])
  useEffect(() => { stopSketchRef.current = stopSketch }, [stopSketch])

  const handleMount = useCallback<OnMount>((editor, monaco) => {
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter, () => {
      runSketchRef.current()
    })
    editor.addCommand(
      monaco.KeyMod.CtrlCmd | monaco.KeyMod.Shift | monaco.KeyCode.Enter,
      () => { stopSketchRef.current() },
    )
  }, [])

  return (
    <div className={s.wrap}>
      <div className={s.toolbar}>
        <IconButton onClick={runSketch} aria-label="Run sketch" title="Run (⌘↵)" disabled={running}>
          <SvgIcon name="play" size={20} intent={running ? "muted" : "success"} />
        </IconButton>
        <IconButton onClick={stopSketch} aria-label="Stop sketch" title="Stop (⌘⇧↵)" disabled={!running}>
          <SvgIcon name="stop" size={20} intent={!running ? "muted" : "danger"} />
        </IconButton>
      </div>

      <div className={s.row}>
        <div className={s.editorPane}>
          <Editor
            height={height}
            defaultLanguage="typescript"
            value={code}
            onChange={(val) => { setCode(val ?? "") }}
            beforeMount={beforeMount}
            onMount={handleMount}
            theme={monacoTheme}
            options={{
              minimap: { enabled: false },
              hover: { enabled: false },
              fontSize: 14,
              scrollBeyondLastLine: false,
            }}
          />
        </div>

        <div className={s.outputPane}>
          {srcdoc ? (
            <iframe
              key={srcdoc}
              srcDoc={srcdoc}
              sandbox="allow-scripts allow-same-origin"
              style={{ display: "block", width: "100%", height, border: "none" }}
              title="p5 sketch"
            />
          ) : error?.startsWith("Infinite loop") ? (
            <div className={s.infiniteLoop} style={{ height }}>
              <span className={s.bombEmoji}>💣</span>
              <span style={{ fontSize: 14 }}>Your code likely has an infinite loop</span>
            </div>
          ) : (
            <div className={s.placeholder} style={{ height }}>
              Press Run to see output
            </div>
          )}
        </div>
      </div>

      {error && !error.startsWith("Infinite loop") && (
        <pre className={s.errorPre}>{error}</pre>
      )}
    </div>
  )
}
