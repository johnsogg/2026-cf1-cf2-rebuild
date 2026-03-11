import { useRef, useState, useCallback, useEffect } from "react"
import Editor, { type BeforeMount } from "@monaco-editor/react"
import p5Source from "p5/lib/p5.min.js?raw"

// Eagerly load all @types/p5 declaration files so Monaco gets p5 global types.
const p5TypeFiles = import.meta.glob<string>(
  "/node_modules/@types/p5/**/*.d.ts",
  { query: "?raw", import: "default", eager: true },
)

const beforeMount: BeforeMount = (monaco) => {
  for (const [path, content] of Object.entries(p5TypeFiles)) {
    monaco.languages.typescript.typescriptDefaults.addExtraLib(
      content,
      `file://${path}`,
    )
  }
}

type Props = {
  initialCode: string
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

export default function P5Exercise({ initialCode }: Props) {
  const [code, setCode] = useState(initialCode)
  const [srcdoc, setSrcdoc] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [running, setRunning] = useState(false)
  const workerRef = useRef<Worker | null>(null)
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
      new URL("../workers/transpiler.worker.ts", import.meta.url),
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

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", maxWidth: 900 }}>
      {/* Toolbar */}
      <div style={{ display: "flex", gap: "0.5rem" }}>
        <button onClick={runSketch} disabled={running}>Run</button>
        <button onClick={stopSketch} disabled={!running}>Stop</button>
      </div>

      {/* Editor + output */}
      <div style={{ display: "flex", gap: "0.5rem" }}>
        <div style={{ flex: 1, border: "1px solid #ccc", borderRadius: 4, overflow: "hidden" }}>
          <Editor
            height="420px"
            defaultLanguage="typescript"
            value={code}
            onChange={(val) => { setCode(val ?? "") }}
            beforeMount={beforeMount}
            options={{
              minimap: { enabled: false },
              hover: { enabled: false },
              fontSize: 14,
              scrollBeyondLastLine: false,
            }}
          />
        </div>

        <div style={{
          flex: 1,
          border: "1px solid #ccc",
          borderRadius: 4,
          overflow: "hidden",
          background: "#f5f5f5",
        }}>
          {srcdoc ? (
            <iframe
              key={srcdoc}
              srcDoc={srcdoc}
              sandbox="allow-scripts allow-same-origin"
              style={{ display: "block", width: "100%", height: "420px", border: "none" }}
              title="p5 sketch"
            />
          ) : error?.startsWith("Infinite loop") ? (
            <div style={{
              height: "420px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: "0.5rem",
              color: "#666",
            }}>
              <span style={{ fontSize: 48 }}>💣</span>
              <span style={{ fontSize: 14 }}>Your code likely has an infinite loop</span>
            </div>
          ) : (
            <div style={{
              height: "420px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#999",
              fontSize: 14,
            }}>
              Press Run to see output
            </div>
          )}
        </div>
      </div>

      {error && !error.startsWith("Infinite loop") && (
        <pre style={{ color: "red", background: "#fee", padding: "0.5rem", borderRadius: 4, margin: 0 }}>
          {error}
        </pre>
      )}
    </div>
  )
}
