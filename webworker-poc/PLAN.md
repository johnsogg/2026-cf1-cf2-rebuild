# Web Worker TypeScript Execution — Spike

## Goal

Prove out the core technical primitive for an interactive code practice
environment: a Monaco editor that sends TypeScript to a Web Worker, which
transpiles and executes it against hidden test assertions, returns structured
results to the main thread, and handles infinite loops via timeout/termination.

This is a client-side-only spike. No backend, no auth, no database.

---

## Tech Stack

- **Vite** with React + TypeScript template
- **@monaco-editor/react** for the editor (handles Monaco's own internal workers automatically)
- **typescript** npm package (bundled into the executor Worker for transpilation)
- Vite's built-in `?worker` syntax for the executor Worker

---

## File Structure

```
webworker-poc/
├── package.json
├── tsconfig.json
├── vite.config.ts
├── index.html
└── src/
    ├── main.tsx
    ├── App.tsx
    ├── exercise.ts              # hardcoded sample exercise
    └── workers/
        └── executor.worker.ts   # the Web Worker
```

---

## Implementation

### 1. Project Setup

```bash
npm create vite@latest . -- --template react-ts
npm install @monaco-editor/react typescript
```

No special Vite config needed beyond the default. Vite handles `?worker`
imports and `@monaco-editor/react` handles Monaco's internal workers.

---

### 2. `src/exercise.ts` — Hardcoded Sample Exercise

Define the exercise as a plain object so it can later be loaded from a config
or API. For this spike, hardcode the `usingGit` exercise:

```typescript
export type Exercise = {
  title: string;
  description: string;
  studentCode: string;   // shown in editor, student edits this
  testCode: string;      // hidden from student, appended at runtime
};

export const infiniteLoopExercise: Exercise = {
  title: "Infinite Loop Test",
  description: "This exercise intentionally contains an infinite loop to test timeout behavior.",
  studentCode: `// This code will never finish
while (true) {
  // infinite loop
}
`,
  testCode: `
test("this will never run", () => {
  expect(true).toBe(true);
});
`,
};

export const sampleExercise: Exercise = {
  title: "initPerson and greet",
  description: `Implement the two functions below.
- initPerson should return a Person object with firstName and lastName set.
- greet should return "Hello, <firstName> <lastName>".`,

  studentCode: `// Your implementation goes here.

export type Person = {
  firstName: string;
  lastName: string;
};

export const initPerson = (first: string, last: string): Person => {
  // IMPLEMENT
  return null;
};

export const greet = (first: string, last: string): string => {
  const person = initPerson(first, last);
  return "this isn't implemented just yet";
};
`,

  testCode: `
test("initPerson function works", () => {
  const xy = initPerson("X", "Y");
  expect(xy).not.toBeNull();
  expect(xy.firstName).toBe("X");
  expect(xy.lastName).toBe("Y");

  const theHeroOfTheStory = initPerson("Bob", "Barker");
  expect(theHeroOfTheStory.firstName).toBe("Bob");
  expect(theHeroOfTheStory.lastName).toBe("Barker");
});

test("greet function works", () => {
  const greeting = greet("Tom", "Jones");
  expect(greeting).not.toBeNull();
  expect(greeting).toBe("Hello, Tom Jones");
});
`,
};
```

---

### 3. `src/workers/executor.worker.ts` — The Executor Worker

This is the most complex file. It must:

1. Receive a message containing `studentCode` (TypeScript) and `testCode` (TypeScript)
2. Transpile both to CommonJS JavaScript using `ts.transpileModule()`
3. Build a concatenated execution script that wires up a minimal module system
4. Capture `console.log` output by overriding it before execution
5. Run a minimal `test`/`expect` implementation
6. Execute everything with `new Function()`
7. `postMessage` structured results back

#### Module system

The student code uses `export const`, and the test code uses `import { ... }
from "./usingGit"`. When both are transpiled to CommonJS, the student code
produces `exports.initPerson = ...` and the test code produces `const
usingGit_1 = require("./usingGit")`. We satisfy this with a minimal shim:

```typescript
import * as ts from "typescript";

type TestResult = {
  name: string;
  passed: boolean;
  error?: string;
};

type WorkerMessage = {
  studentCode: string;
  testCode: string;
};

type WorkerResponse = {
  results: TestResult[];
  logs: string[];
  error?: string;
};

self.onmessage = (e: MessageEvent<WorkerMessage>) => {
  const { studentCode, testCode } = e.data;
  const logs: string[] = [];
  const results: TestResult[] = [];

  // Override console.log to capture output
  const originalLog = console.log;
  console.log = (...args: unknown[]) => {
    logs.push(args.map(String).join(" "));
  };

  try {
    // Transpile both files to CommonJS
    const transpileOpts: ts.TranspileOptions = {
      compilerOptions: {
        module: ts.ModuleKind.CommonJS,
        target: ts.ScriptTarget.ES2020,
        strict: false,
      },
    };

    const studentJS = ts.transpileModule(studentCode, transpileOpts).outputText;
    const testJS = ts.transpileModule(testCode, transpileOpts).outputText;

    // Build the full execution script
    const script = buildScript(studentJS, testJS, results);

    // Execute
    new Function(script)();

  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    const response: WorkerResponse = { results, logs, error: message };
    self.postMessage(response);
    return;
  } finally {
    console.log = originalLog;
  }

  const response: WorkerResponse = { results, logs };
  self.postMessage(response);
};

function buildScript(studentJS: string, testJS: string, results: TestResult[]): string {
  // This function returns a string of JS that will be executed via new Function().
  // It injects `results` by reference via closure — but new Function() doesn't
  // have closure access. Instead, serialize the minimal runtime as a string and
  // collect results via a shared array injected as a parameter.
  //
  // Better approach: run new Function with `results` passed as argument.
  // See implementation note below.
  return `
    // --- Minimal module system ---
    const studentExports = {};
    const require = (name) => {
      if (name === './usingGit' || name === './solution' || name === './main') {
        return studentExports;
      }
      throw new Error('Unknown module: ' + name);
    };

    // --- Run student code, capturing exports ---
    (function(exports) {
      ${studentJS}
    })(studentExports);

    // --- Minimal test runner ---
    const results = [];

    const test = (name, fn) => {
      try {
        fn();
        results.push({ name, passed: true });
      } catch(e) {
        results.push({ name, passed: false, error: e.message });
      }
    };

    const expect = (actual) => ({
      toBe: (expected) => {
        if (actual !== expected)
          throw new Error('Expected ' + JSON.stringify(expected) + ', got ' + JSON.stringify(actual));
      },
      toEqual: (expected) => {
        if (JSON.stringify(actual) !== JSON.stringify(expected))
          throw new Error('Expected ' + JSON.stringify(expected) + ', got ' + JSON.stringify(actual));
      },
      toBeNull: () => {
        if (actual !== null)
          throw new Error('Expected null, got ' + JSON.stringify(actual));
      },
      toBeDefined: () => {
        if (actual === undefined)
          throw new Error('Expected defined value, got undefined');
      },
      not: {
        toBe: (expected) => {
          if (actual === expected)
            throw new Error('Expected not ' + JSON.stringify(expected));
        },
        toBeNull: () => {
          if (actual === null)
            throw new Error('Expected non-null value');
        },
        toBeDefined: () => {
          if (actual !== undefined)
            throw new Error('Expected undefined');
        },
      },
    });

    // Bring student exports into scope for test code
    const { ${Object.keys({}).join(', ')} } = studentExports;

    // --- Run test code ---
    // (studentExports destructured via with() or explicit extraction)
    // Use a with() block to expose studentExports keys as local variables.
    // with() is forbidden in strict mode, so we use indirect eval in sloppy mode.

    ${testJS}

    return results;
  `;
}
```

**Implementation note on result passing:** The cleanest approach is to make
`buildScript` return a string that ends with `return results;`, then call it as:

```typescript
const fn = new Function(script);
const rawResults: TestResult[] = fn();
results.push(...rawResults);
```

The `with()` trick for exposing student exports to test code is forbidden in
strict mode. Instead, use explicit destructuring: before running the test code,
extract the known exports. Since the test file's import is transformed to
`const usingGit_1 = require("./usingGit")` by CommonJS transpilation, and the
`require` function already returns `studentExports`, no destructuring trick is
needed — the test code accesses exports via `usingGit_1.initPerson(...)` etc.,
which works naturally.

Verify this is the case by logging the transpiled test output during development.

---

### 4. `src/App.tsx` — Main UI

State:
- `code: string` — current editor content, initialized from `sampleExercise.studentCode`
- `results: TestResult[]`
- `logs: string[]`
- `running: boolean`
- `timedOut: boolean`
- `error: string | undefined`

On mount, create the Worker. On unmount, terminate it.

**Run handler:**

```typescript
const handleRun = () => {
  if (running) return;
  setRunning(true);
  setTimedOut(false);
  setResults([]);
  setLogs([]);
  setError(undefined);

  // Create a fresh Worker for each run (avoids state leakage between runs)
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
```

Note: a fresh Worker is created per run. This is slightly more expensive than
reusing a Worker, but it guarantees clean state and avoids any risk of a
previous execution's side effects leaking into the next run. At this scale it
is not a performance concern.

**Layout (minimal, functional):**

```
┌─────────────────────────────────────────────────────┐
│ Title + description                                  │
├─────────────────────────────────────────────────────┤
│ Monaco Editor (400px height)                        │
├─────────────────────────────────────────────────────┤
│ [Run] button                    [running indicator] │
├─────────────────────────────────────────────────────┤
│ Results:                                            │
│  ✓ initPerson function works                        │
│  ✗ greet function works — Expected "Hello, Tom...  │
├─────────────────────────────────────────────────────┤
│ Console output (if any)                             │
└─────────────────────────────────────────────────────┘
```

Show a clear "Execution timed out (possible infinite loop)" message when
`timedOut` is true.

---

### 5. Worker import in App.tsx

```typescript
import ExecutorWorker from "./workers/executor.worker?worker";
```

Vite handles this natively. No additional config needed.

---

## Verification / Definition of Done

1. **Happy path:** Student implements `initPerson` and `greet` correctly → both tests show ✓
2. **Failing tests:** Student leaves stubs as-is → both tests show ✗ with error messages
3. **Infinite loop:** Student writes `while(true) {}` → UI shows "timed out" after ~5 seconds, remains fully interactive
4. **Console output:** `console.log("hello")` in student code appears in the output panel
5. **TypeScript errors:** Student writes invalid TS (e.g. wrong return type) → transpilation error is caught and displayed, does not crash the app

---

## Known Limitations (acceptable for spike)

- The `require()` shim hardcodes module name aliases. A real implementation
  would derive these from the exercise definition.
- The `expect()` matcher covers only the subset of Jest matchers used in the
  existing homework. Extending it is mechanical.
- The TypeScript compiler bundle is large (~5MB). Acceptable for a spike;
  a production build would want the Worker bundle cached aggressively.
- No TypeScript strict mode in transpilation (`strict: false`) to avoid
  blocking execution on type errors the student hasn't addressed yet.
