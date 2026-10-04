import { useRef, useState, useCallback, useEffect } from "react"
import Editor, { type BeforeMount, type OnMount } from "@monaco-editor/react"
import { buildSrcdoc } from "../utils/p5Srcdoc"
import { useTheme } from "../hooks/useTheme"
import { registerMonacoThemes, monacoThemeName } from "../utils/monacoThemes"
import { isolateMonacoTypescriptFiles } from "../utils/monacoIsolation"
import { IconButton } from "./IconButton"
import { SvgIcon } from "./SvgIcon"
import s from "./P5Exercise.module.css"
import p5SoundTypes from "../vendor/p5.sound-0.4.1.d.ts?raw"

const AUTOSTOP_SECONDS = 120

function AutoStopSvg({
  autoStop,
  timeLeft,
  running,
}: {
  autoStop: boolean
  timeLeft: number
  running: boolean
}) {
  const r = 9
  const C = 2 * Math.PI * r
  const progress = autoStop && running ? timeLeft / AUTOSTOP_SECONDS : 1
  const dashOffset = C * (1 - progress)

  return (
    <svg width={20} height={20} viewBox="0 0 24 24" aria-hidden="true">
      {/* Track ring */}
      <circle
        cx={12}
        cy={12}
        r={r}
        fill="none"
        stroke="var(--border, #ccc)"
        strokeWidth={2}
      />
      {/* Progress arc */}
      <circle
        cx={12}
        cy={12}
        r={r}
        fill="none"
        stroke={
          autoStop ? "var(--success, #4caf50)" : "var(--text-muted, #999)"
        }
        strokeWidth={2}
        strokeDasharray={String(C)}
        strokeDashoffset={String(dashOffset)}
        strokeLinecap="round"
        transform="rotate(-90 12 12)"
        style={{
          transition:
            running && autoStop ? "stroke-dashoffset 1s linear" : "none",
        }}
      />
      {/* Clock face */}
      <circle cx={12} cy={12} r={7} fill="var(--bg, white)" />
      {autoStop ? (
        // Leaf
        <path
          d="M12 15.5 Q9 12 12 9 Q15 12 12 15.5Z"
          fill="var(--success, #4caf50)"
        />
      ) : (
        // Infinity symbol
        <path
          d="M12 12C10.5 9.5 7.5 9.5 7.5 12C7.5 14.5 10.5 14.5 12 12C13.5 9.5 16.5 9.5 16.5 12C16.5 14.5 13.5 14.5 12 12Z"
          fill="none"
          stroke="var(--text-muted, #999)"
          strokeWidth={1.5}
        />
      )}
    </svg>
  )
}

// Eagerly load p5's bundled declaration files so Monaco gets p5 global types.
// Path goes up from immerse/src/components/ to the monorepo root node_modules.
// (p5 ships its own types as of v2 — no separate @types/p5 package anymore.)
const p5TypeFiles = import.meta.glob<string>(
  "../../../node_modules/p5/types/**/*.d.ts",
  { query: "?raw", import: "default", eager: true },
)

const beforeMount: BeforeMount = (monaco) => {
  registerMonacoThemes(monaco)
  isolateMonacoTypescriptFiles(monaco)
  for (const [path, content] of Object.entries(p5TypeFiles)) {
    // Normalize relative key to a virtual absolute path Monaco can cross-reference
    const virtualPath = path.replace("../../../node_modules", "/node_modules")
    monaco.languages.typescript.typescriptDefaults.addExtraLib(
      content,
      `file://${virtualPath}`,
    )
  }
  // p5.sound ships no types, so ours are hand-written. Registered for every
  // editor (Monaco shares one TS service across the page), not just
  // exercises with the `sound` flag.
  monaco.languages.typescript.typescriptDefaults.addExtraLib(
    p5SoundTypes,
    "file:///node_modules/p5/types/p5.sound.d.ts",
  )
}

export type P5ExerciseProps = {
  initialCode: string
  size?: "small" | "medium" | "large"
  autorun?: boolean
  hoverInfo?: boolean
  /** Also load p5.sound into the sketch iframe (loadSound, p5.Oscillator, …). */
  sound?: boolean
  /** Show a button that expands the editor and sketch to fill the window. */
  allowFullScreenEditor?: boolean
  /** Show a button that fills the window with just the sketch, scaled to fit. */
  allowFullScreenSketch?: boolean
}

/** Which full-screen takeover is showing, if any. */
type FullScreenMode = "editor" | "sketch" | null

type TranspilerResponse = {
  js?: string
  error?: string
}

type SketchError = {
  message: string
  line?: number
  col?: number
  stack?: string
}


/**
 * Editable p5 sketchpad. Student writes/modifies p5 code in a Monaco editor
 * and sees the result rendered live. No automated grading — success is
 * visual ("make the ball follow the cursor"). Always used inside an `Ask`,
 * which owns identity, numbering, and completion tracking.
 **/
export function P5Exercise({ exercise }: { exercise: P5ExerciseProps }) {
  const {
    initialCode,
    hoverInfo = true,
    sound = false,
    allowFullScreenEditor = false,
    allowFullScreenSketch = false,
  } = exercise
  const [fullScreen, setFullScreen] = useState<FullScreenMode>(null)
  // In a takeover, the panes stretch to fill the window instead.
  const height = fullScreen
    ? "100%"
    : { small: "200px", medium: "400px", large: "80vh" }[
        exercise.size ?? "medium"
      ]
  const [code, setCode] = useState(initialCode)
  const [srcdoc, setSrcdoc] = useState<string | null>(null)
  const [error, setError] = useState<SketchError | null>(null)
  const [running, setRunning] = useState(false)
  const [autoStop, setAutoStop] = useState(true)
  const [timeLeft, setTimeLeft] = useState(AUTOSTOP_SECONDS)
  const workerRef = useRef<Worker | null>(null)
  const iframeRef = useRef<HTMLIFrameElement | null>(null)
  const [appTheme] = useTheme()
  const monacoTheme = monacoThemeName(appTheme)

  useEffect(() => {
    const handler = (e: MessageEvent<SketchError & { type: string }>) => {
      if (e.data?.type === "sketch-error") {
        setError({
          message: e.data.message,
          line: e.data.line,
          col: e.data.col,
          stack: e.data.stack,
        })
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
        setError({ message: transpileError })
        setRunning(false)
        return
      }

      setSrcdoc(buildSrcdoc(js ?? "", { sound }))
      setRunning(true)
    }

    worker.onerror = (e) => {
      setError({ message: e.message })
      setRunning(false)
      worker.terminate()
      workerRef.current = null
    }

    worker.postMessage({ code })
  }, [code, sound, stopSketch])

  // Countdown timer: starts fresh whenever sketch starts in eco mode
  useEffect(() => {
    if (!running || !autoStop) {
      setTimeLeft(AUTOSTOP_SECONDS)
      return
    }
    setTimeLeft(AUTOSTOP_SECONDS)
    const id = setInterval(() => {
      setTimeLeft((prev) => prev - 1)
    }, 1000)
    return () => clearInterval(id)
  }, [running, autoStop])

  // Stop sketch when countdown expires
  useEffect(() => {
    if (timeLeft <= 0) stopSketch()
  }, [timeLeft, stopSketch])

  const runSketchRef = useRef(runSketch)
  const stopSketchRef = useRef(stopSketch)
  useEffect(() => {
    runSketchRef.current = runSketch
  }, [runSketch])
  useEffect(() => {
    stopSketchRef.current = stopSketch
  }, [stopSketch])

  useEffect(() => {
    if (exercise.autorun) runSketchRef.current()
  }, [exercise.autorun])

  // Tell the sketch whether to scale its canvas up to fill the window.
  const sendFit = useCallback(() => {
    iframeRef.current?.contentWindow?.postMessage(
      { type: "immerse-fit", fit: fullScreen === "sketch" },
      "*",
    )
  }, [fullScreen])

  useEffect(() => {
    sendFit()
  }, [sendFit])

  // While a takeover is showing: Esc closes it (unless the code editor has
  // focus, since Monaco uses Esc itself), and the page behind can't scroll.
  useEffect(() => {
    if (!fullScreen) return
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null
      if (e.key === "Escape" && !target?.closest(".monaco-editor")) {
        setFullScreen(null)
      }
    }
    // The sketch iframe swallows key presses, so it forwards Esc to us.
    const onMessage = (e: MessageEvent) => {
      if (
        e.data?.type === "sketch-escape" &&
        e.source === iframeRef.current?.contentWindow
      ) {
        setFullScreen(null)
      }
    }
    window.addEventListener("keydown", onKey)
    window.addEventListener("message", onMessage)
    const oldOverflow = document.body.style.overflow
    document.body.style.overflow = "hidden"
    return () => {
      window.removeEventListener("keydown", onKey)
      window.removeEventListener("message", onMessage)
      document.body.style.overflow = oldOverflow
    }
  }, [fullScreen])

  const handleMount = useCallback<OnMount>((editor, monaco) => {
    // Dynamic keybindings share one global registry across every Monaco
    // instance on the page; without this, only the last-mounted exercise's
    // shortcut would actually fire.
    const thisEditorOnly = `editorId == '${editor.getId()}'`
    editor.addCommand(
      monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter,
      () => {
        runSketchRef.current()
      },
      thisEditorOnly,
    )
    editor.addCommand(
      monaco.KeyMod.CtrlCmd | monaco.KeyMod.Shift | monaco.KeyCode.Enter,
      () => {
        stopSketchRef.current()
      },
      thisEditorOnly,
    )
  }, [])

  return (
    <div
      className={[
        s.wrap,
        fullScreen && s.fullScreen,
        fullScreen === "sketch" && s.sketchOnly,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <div className={s.header}>
        {fullScreen && (
          <button
            className={s.closeButton}
            onClick={() => setFullScreen(null)}
            title="Close full screen (Esc)"
          >
            <SvgIcon name="close" size={22} />
            Close
          </button>
        )}
        <div className={s.toolbar}>
          <IconButton
            onClick={runSketch}
            aria-label="Run sketch"
            title="Run (⌘↵)"
            disabled={running}
          >
            <SvgIcon
              name="play"
              size={20}
              intent={running ? "muted" : "success"}
            />
          </IconButton>
          <IconButton
            onClick={stopSketch}
            aria-label="Stop sketch"
            title="Stop (⌘⇧↵)"
            disabled={!running}
          >
            <SvgIcon
              name="stop"
              size={20}
              intent={!running ? "muted" : "danger"}
            />
          </IconButton>
          <IconButton
            onClick={() => setAutoStop((a) => !a)}
            aria-label={
              autoStop
                ? "Auto-stop after 2 minutes — click for infinite run"
                : "Infinite run — click for auto-stop after 2 minutes"
            }
            title={
              autoStop
                ? "Auto-stop after 2 min (click for infinite)"
                : "Infinite run (click for auto-stop)"
            }
          >
            <AutoStopSvg
              autoStop={autoStop}
              timeLeft={timeLeft}
              running={running}
            />
          </IconButton>
          {allowFullScreenEditor && !fullScreen && (
            <IconButton
              onClick={() => setFullScreen("editor")}
              aria-label="Full screen: code and sketch"
              title="Full screen: code and sketch"
            >
              <SvgIcon name="fullscreen" size={20} />
            </IconButton>
          )}
          {allowFullScreenSketch && !fullScreen && (
            <IconButton
              onClick={() => setFullScreen("sketch")}
              aria-label="Full screen: sketch only"
              title="Full screen: sketch only"
            >
              <SvgIcon name="monitor" size={20} />
            </IconButton>
          )}
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
              // re-measure when a full-screen takeover resizes the pane
              automaticLayout: true,
            }}
          />
        </div>

        <div className={s.outputPane}>
          {srcdoc ? (
            <iframe
              ref={iframeRef}
              onLoad={sendFit}
              key={srcdoc}
              srcDoc={srcdoc}
              sandbox="allow-scripts allow-same-origin"
              style={{
                display: "block",
                width: "100%",
                height,
                border: "none",
              }}
              title="p5 sketch"
            />
          ) : error?.message.startsWith("Infinite loop") ? (
            <div className={s.infiniteLoop} style={{ height }}>
              <span className={s.bombEmoji}>💣</span>
              <span style={{ fontSize: 14 }}>
                Your code likely has an infinite loop
              </span>
            </div>
          ) : (
            <div className={s.placeholder} style={{ height }}>
              Press Run to see output
            </div>
          )}
        </div>
      </div>

      {error && !error.message.startsWith("Infinite loop") && (
        <pre className={s.errorPre}>
          {error.message}
          {error.line != null
            ? ` (line ${error.line}${error.col != null ? `, col ${error.col}` : ""})`
            : ""}
          {error.stack ? `\n\n${error.stack}` : ""}
        </pre>
      )}
    </div>
  )
}
