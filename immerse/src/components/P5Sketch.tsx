import { useRef, useState, useCallback, useEffect } from "react"
import { buildSrcdoc } from "../utils/p5Srcdoc"
import { IconButton } from "./IconButton"
import { SvgIcon } from "./SvgIcon"
import s from "./P5Sketch.module.css"

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


export type P5SketchProps = {
  code: string
  autoplay?: boolean
  allowStop?: boolean
  allowReset?: boolean
  size?: "small" | "medium" | "large"
  title?: string
  dimensions?: { width: number; height: number }
  layout?: "wide" | "content"
}
/**
 * Display-only, no editing. You give it code (usually imported
 * from a .ts file), it runs the sketch in an iframe. Used to show pre-written
 * examples inline in the text. Globally available in book `.mdx` sections,
 * no import needed. For short throwaway snippets with no source file, use a
 * ` ```p5sketch autoplay width=300 height=100 ` fenced code block instead —
 * it expands to this component at build time. `allowReset` (default false)
 * overlays a refresh button on the canvas that restarts the sketch — useful
 * for sketches whose `setup()` uses `random()` so each run looks different.
 **/
export function P5Sketch({
  code,
  autoplay = false,
  allowStop = false,
  allowReset = false,
  size = "medium",
  title = "p5 sketch",
  dimensions = undefined,
  layout = "wide",
}: P5SketchProps) {
  const height =
    dimensions?.height ||
    { small: "200px", medium: "400px", large: "80vh" }[size]
  const width = dimensions?.width ? `${dimensions.width}px` : "100%"
  const [srcdoc, setSrcdoc] = useState<string | null>(null)
  const [error, setError] = useState<SketchError | null>(null)
  const [running, setRunning] = useState(false)
  const [runId, setRunId] = useState(0)
  const workerRef = useRef<Worker | null>(null)

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
    if (workerRef.current) {
      workerRef.current.terminate()
      workerRef.current = null
    }
    setSrcdoc(null)
    setRunning(false)

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
      setSrcdoc(buildSrcdoc(js ?? ""))
      // Bump the key even when the code (and so the transpiled srcdoc) is
      // unchanged, so re-running remounts the iframe instead of reusing the
      // old one — needed for `allowReset` to actually restart sketches that
      // look the same each time except for their random() calls.
      setRunId((id) => id + 1)
      setRunning(true)
    }

    worker.onerror = (e) => {
      setError({ message: e.message })
      setRunning(false)
      worker.terminate()
      workerRef.current = null
    }

    worker.postMessage({ code })
  }, [code])

  // Keep a ref so the autoplay effect doesn't capture a stale runSketch
  const runSketchRef = useRef(runSketch)
  useEffect(() => {
    runSketchRef.current = runSketch
  }, [runSketch])

  // Autoplay on mount

  useEffect(() => {
    if (autoplay) runSketchRef.current()
  }, [])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (workerRef.current) {
        workerRef.current.terminate()
        workerRef.current = null
      }
    }
  }, [])

  const gridColumn = layout === "content" ? "content" : "full"

  return (
    <div className={`${s.wrap} p5-sketch-wrap`} style={{ gridColumn }}>
      <div className={s.row}>
        <div className={s.canvas}>
          {srcdoc ? (
            <iframe
              key={runId}
              srcDoc={srcdoc}
              sandbox="allow-scripts allow-same-origin"
              style={{
                display: "block",
                width,
                height,
                border: "none",
              }}
              title={title}
            />
          ) : null}

          {allowReset && running && (
            <div className={s.resetButton}>
              <IconButton
                onClick={runSketch}
                aria-label="Reset sketch"
                title="Reset"
              >
                <SvgIcon name="refresh" size={18} intent="muted" />
              </IconButton>
            </div>
          )}

          {!srcdoc && (
            <div
              className={s.placeholder}
              style={{ height }}
              onClick={runSketch}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") runSketch()
              }}
              aria-label="Start sketch"
            >
              Click to start
            </div>
          )}
        </div>

        {running && allowStop && (
          <div className={s.stopCol}>
            <IconButton
              onClick={stopSketch}
              aria-label="Stop sketch"
              title="Stop"
            >
              <SvgIcon name="stop" size={20} intent="danger" />
            </IconButton>
          </div>
        )}
      </div>

      {error && (
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
