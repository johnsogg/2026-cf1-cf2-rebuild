import { useRef, useState, useCallback, useEffect } from "react"
import p5Source from "p5/lib/p5.min.js?raw"
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

// NOTE: buildSrcdoc is duplicated in P5Exercise.tsx — keep both in sync.
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
      window.onerror = function(msg, _src, line, col, err) {
        parent.postMessage({ type: 'sketch-error', message: err ? err.message : String(msg), line: line, col: col, stack: err ? err.stack : null }, '*');
      };
      try {
        ${studentJS}
      } catch (e) {
        parent.postMessage({ type: 'sketch-error', message: e instanceof Error ? e.message : String(e), stack: e instanceof Error ? e.stack : null }, '*');
      }
    <\/script>
  </body>
</html>`
}

export type P5SketchProps = {
  code: string
  autoplay?: boolean
  allowStop?: boolean
  size?: "small" | "medium" | "large"
  title?: string
  dimensions?: { width: number; height: number }
}

export function P5Sketch({
  code,
  autoplay = false,
  allowStop = false,
  size = "medium",
  title = "p5 sketch",
  dimensions = undefined,
}: P5SketchProps) {
  const height =
    dimensions?.height ||
    { small: "200px", medium: "400px", large: "80vh" }[size]
  const width = dimensions?.width ? `${dimensions.width}px` : "100%"
  const [srcdoc, setSrcdoc] = useState<string | null>(null)
  const [error, setError] = useState<SketchError | null>(null)
  const [running, setRunning] = useState(false)
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

  return (
    <div className={s.wrap}>
      <div className={s.row}>
        <div className={s.canvas}>
          {srcdoc ? (
            <iframe
              key={srcdoc}
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
          ) : (
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
