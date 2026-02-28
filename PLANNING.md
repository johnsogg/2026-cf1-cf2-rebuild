# CF1/CF2 Rebuild — Planning Notes

*Last updated: 2026-02-25*

---

## What this is

A rebuild of the CF1/CF2 curriculum as an interactive, browser-based code
practice environment. Students write TypeScript (and possibly Python) in an
editor, run their code against hidden tests, and get instant feedback — all
client-side, no server required for code execution.

Still in early exploration. No commitment to build the full thing yet.

---

## Current state

### `webworker-poc/` — DONE, working spike

Proves out the core technical primitive:

- Monaco editor in a React/Vite app
- Student code is sent to a Web Worker on "Run"
- Worker transpiles TypeScript via `ts.transpileModule()` and executes it
  against hidden test assertions using a minimal `test()`/`expect()` runner
- Structured results (pass/fail per test, console output, errors) are returned
  to the main thread
- Infinite loop protection: worker is terminated after 5 seconds, UI shows a
  timeout banner and remains fully interactive
- Fresh worker per run (clean state, no leakage between runs)

**All verification criteria passed:**
- Failing stubs → red ✗ with error messages
- Correct implementation → green ✓
- Infinite loop → yellow timeout banner after ~5s
- `console.log()` in student code → captured and shown in output panel
- Transpilation errors → caught and displayed, app does not crash

**Key files:**
- `src/exercise.ts` — `Exercise` type + two hardcoded exercises
- `src/workers/executor.worker.ts` — transpile + execute + return results
- `src/App.tsx` — editor, run button, results display

---

## Open questions / next decisions

1. **Is this actually getting built?** The spike proves it's feasible. Decide
   whether to continue before doing more work.

2. **Scope: how many exercises?** The CF1/CF2 homework set is the starting
   point. See `historical-resources/` for the existing material.

3. **Python support?** Pyodide (CPython → WASM) would let students write real
   Python. ~10MB initial load, subsequent executions fast. Viable for a
   browser-only tool.

4. **Exercise authoring format.** Right now exercises are hardcoded TypeScript
   objects. A real system needs a format for writing and loading exercises
   (JSON/YAML files? Markdown with fenced code blocks? A small admin UI?).

5. **Polish pass on the POC.** The UI is functional but bare. Before showing
   it to anyone, it needs: better layout, exercise navigation, a way to reset
   to starter code, and possibly syntax error highlighting in the editor.

6. **Type-checking vs. transpile-only.** `ts.transpileModule()` skips type
   checking — it will happily run code with type errors. Running the full
   compiler (`ts.createProgram`) would surface type errors to students but is
   significantly heavier. Worth a deliberate decision.

---

## What to do next (when returning to this)

1. Read `webworker-poc/PLAN.md` for full architecture details and known
   limitations.
2. Start `npm run dev` from `webworker-poc/` to pick up where you left off.
3. The most logical next step is probably exercise authoring: define a format
   for writing exercises and build a way to load them, so you can author the
   actual CF1/CF2 content.
