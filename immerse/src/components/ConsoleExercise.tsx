import { useRef, useState, useCallback, useEffect } from "react"
import Editor, { type BeforeMount, type OnMount } from "@monaco-editor/react"
import { useTheme } from "../hooks/useTheme"
import { registerMonacoThemes, monacoThemeName } from "../utils/monacoThemes"
import { isolateMonacoTypescriptFiles } from "../utils/monacoIsolation"
import { IconButton } from "./IconButton"
import { SvgIcon } from "./SvgIcon"
import s from "./ConsoleExercise.module.css"

const beforeMount: BeforeMount = (monaco) => {
  registerMonacoThemes(monaco)
  isolateMonacoTypescriptFiles(monaco)
}

export type ConsoleExerciseProps = {
  initialCode: string
  size?: "small" | "medium" | "large"
  autorun?: boolean
  hoverInfo?: boolean
}

type WorkerResponse =
  | { type: "log"; text: string }
  | { type: "error"; message: string; stack?: string }
  | { type: "done" }

type RunError = {
  message: string
  stack?: string
}

/**
 * Editable console program. Student writes/modifies plain JS/TS in a Monaco
 * editor and sees the console.log output on the right. No automated
 * grading. Always used inside an `Ask`, which owns identity, numbering,
 * and completion tracking.
 **/
export function ConsoleExercise({
  exercise,
}: {
  exercise: ConsoleExerciseProps
}) {
  const { initialCode, hoverInfo = true } = exercise
  const height = { small: "200px", medium: "400px", large: "80vh" }[
    exercise.size ?? "medium"
  ]
  const [code, setCode] = useState(initialCode)
  const [logs, setLogs] = useState<string[]>([])
  const [error, setError] = useState<RunError | null>(null)
  const [running, setRunning] = useState(false)
  const workerRef = useRef<Worker | null>(null)
  const outputRef = useRef<HTMLPreElement | null>(null)
  const [appTheme] = useTheme()
  const monacoTheme = monacoThemeName(appTheme)

  useEffect(() => {
    if (outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight
    }
  }, [logs])

  const stopRun = useCallback(() => {
    setRunning(false)
    if (workerRef.current) {
      workerRef.current.terminate()
      workerRef.current = null
    }
  }, [])

  const runCode = useCallback(() => {
    setError(null)
    setLogs([])
    stopRun()

    const worker = new Worker(
      new URL("../workers/consoleExecutor.worker.ts", import.meta.url),
      { type: "module" },
    )
    workerRef.current = worker
    setRunning(true)

    worker.onmessage = (e: MessageEvent<WorkerResponse>) => {
      const data = e.data
      if (data.type === "log") {
        setLogs((prev) => [...prev, data.text])
      } else if (data.type === "error") {
        setError({ message: data.message, stack: data.stack })
        stopRun()
      }
    }

    worker.onerror = (e) => {
      setError({ message: e.message })
      stopRun()
    }

    worker.postMessage({ code })
  }, [code, stopRun])

  const runCodeRef = useRef(runCode)
  const stopRunRef = useRef(stopRun)
  useEffect(() => {
    runCodeRef.current = runCode
  }, [runCode])
  useEffect(() => {
    stopRunRef.current = stopRun
  }, [stopRun])

  useEffect(() => {
    if (exercise.autorun) runCodeRef.current()
  }, [exercise.autorun])

  useEffect(() => {
    return () => {
      if (workerRef.current) workerRef.current.terminate()
    }
  }, [])

  const handleMount = useCallback<OnMount>((editor, monaco) => {
    // Dynamic keybindings share one global registry across every Monaco
    // instance on the page; without this, only the last-mounted exercise's
    // shortcut would actually fire.
    const thisEditorOnly = `editorId == '${editor.getId()}'`
    editor.addCommand(
      monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter,
      () => {
        runCodeRef.current()
      },
      thisEditorOnly,
    )
    editor.addCommand(
      monaco.KeyMod.CtrlCmd | monaco.KeyMod.Shift | monaco.KeyCode.Enter,
      () => {
        stopRunRef.current()
      },
      thisEditorOnly,
    )
  }, [])

  return (
    <div className={s.wrap}>
      <div className={s.header}>
        <div className={s.toolbar}>
          <IconButton
            onClick={runCode}
            aria-label="Run program"
            title="Run (⌘↵)"
          >
            <SvgIcon name="play" size={20} intent="success" />
          </IconButton>
          <IconButton
            onClick={stopRun}
            aria-label="Stop program"
            title="Stop (⌘⇧↵)"
            disabled={!running}
          >
            <SvgIcon
              name="stop"
              size={20}
              intent={!running ? "muted" : "danger"}
            />
          </IconButton>
        </div>
      </div>

      <div className={s.row}>
        <div className={s.editorPane}>
          <Editor
            height={height}
            defaultLanguage="typescript"
            value={code}
            onChange={(val) => {
              setCode(val ?? "")
            }}
            beforeMount={beforeMount}
            onMount={handleMount}
            theme={monacoTheme}
            options={{
              minimap: { enabled: false },
              hover: { enabled: hoverInfo },
              fontSize: 14,
              scrollBeyondLastLine: false,
            }}
          />
        </div>

        <div className={s.outputPane}>
          {logs.length > 0 ? (
            <pre ref={outputRef} className={s.console}>
              {logs.join("\n")}
            </pre>
          ) : (
            <div className={s.placeholder} style={{ height }}>
              Press Run to see output
            </div>
          )}
        </div>
      </div>

      {error && (
        <pre className={s.errorPre}>
          {error.message}
          {error.stack ? `\n\n${error.stack}` : ""}
        </pre>
      )}
    </div>
  )
}
