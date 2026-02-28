import { useState } from "react";
import Editor from "@monaco-editor/react";
// ?worker is Vite-specific syntax for 
import ExecutorWorker from "./workers/executor.worker?worker";
import { sampleExercise } from "./exercise";

type TestResult = {
  name: string;
  passed: boolean;
  error?: string;
};

type WorkerResponse = {
  results: TestResult[];
  logs: string[];
  error?: string;
};

function App() {
  const [code, setCode] = useState(sampleExercise.studentCode);
  const [results, setResults] = useState<TestResult[]>([]);
  const [logs, setLogs] = useState<string[]>([]);
  const [running, setRunning] = useState(false);
  const [timedOut, setTimedOut] = useState(false);
  const [error, setError] = useState<string | undefined>();

  const handleRun = () => {
    if (running) return;
    setRunning(true);
    setTimedOut(false);
    setResults([]);
    setLogs([]);
    setError(undefined);

    const worker = new ExecutorWorker();

    const timeout = setTimeout(() => {
      worker.terminate();
      setTimedOut(true);
      setRunning(false);
    }, 5000);

    worker.onmessage = (e: MessageEvent<WorkerResponse>) => {
      clearTimeout(timeout);
      worker.terminate();
      setResults(e.data.results);
      setLogs(e.data.logs);
      setError(e.data.error);
      setRunning(false);
    };

    worker.postMessage({
      studentCode: code,
      testCode: sampleExercise.testCode,
    });
  };

  return (
    <div style={{ maxWidth: 800, margin: "0 auto", padding: "24px 16px", fontFamily: "system-ui, sans-serif" }}>
      <h1 style={{ marginBottom: 4 }}>{sampleExercise.title}</h1>
      <p style={{ marginBottom: 16, whiteSpace: "pre-line", color: "#444" }}>
        {sampleExercise.description}
      </p>

      <div style={{ border: "1px solid #ccc", borderRadius: 4, overflow: "hidden", marginBottom: 12 }}>
        <Editor
          height="400px"
          defaultLanguage="typescript"
          value={code}
          onChange={(val) => setCode(val ?? "")}
          options={{ minimap: { enabled: false }, fontSize: 14 }}
        />
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
        <button
          onClick={handleRun}
          disabled={running}
          style={{
            padding: "8px 20px",
            fontSize: 15,
            cursor: running ? "not-allowed" : "pointer",
            background: running ? "#999" : "#1a73e8",
            color: "#fff",
            border: "none",
            borderRadius: 4,
          }}
        >
          Run
        </button>
        {running && <span style={{ color: "#666" }}>Running...</span>}
      </div>

      {timedOut && (
        <div style={{ background: "#fff3cd", border: "1px solid #ffc107", borderRadius: 4, padding: "10px 14px", marginBottom: 12 }}>
          Execution timed out — possible infinite loop. The worker was terminated after 5 seconds.
        </div>
      )}

      {error && (
        <div style={{ background: "#fdecea", border: "1px solid #f44336", borderRadius: 4, padding: "10px 14px", marginBottom: 12, fontFamily: "monospace", whiteSpace: "pre-wrap" }}>
          <strong>Error:</strong> {error}
        </div>
      )}

      {results.length > 0 && (
        <div style={{ marginBottom: 16 }}>
          <h3 style={{ marginBottom: 8 }}>Results</h3>
          {results.map((r) => (
            <div
              key={r.name}
              style={{
                padding: "8px 12px",
                marginBottom: 6,
                borderRadius: 4,
                background: r.passed ? "#e6f4ea" : "#fdecea",
                border: `1px solid ${r.passed ? "#34a853" : "#f44336"}`,
              }}
            >
              <span style={{ marginRight: 8 }}>{r.passed ? "✓" : "✗"}</span>
              <strong>{r.name}</strong>
              {!r.passed && r.error && (
                <div style={{ marginTop: 4, fontFamily: "monospace", fontSize: 13, color: "#c62828" }}>
                  {r.error}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {logs.length > 0 && (
        <div>
          <h3 style={{ marginBottom: 8 }}>Console output</h3>
          <pre
            style={{
              background: "#1e1e1e",
              color: "#d4d4d4",
              padding: "12px 16px",
              borderRadius: 4,
              fontFamily: "monospace",
              fontSize: 13,
              overflowX: "auto",
              margin: 0,
            }}
          >
            {logs.join("\n")}
          </pre>
        </div>
      )}
    </div>
  );
}

export default App;
