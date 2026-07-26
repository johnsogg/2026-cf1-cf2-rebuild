# Book TODO

Working notes on things to revisit. Not a backlog to clear — a place to capture
ideas without breaking drafting momentum. P3s that sit too long should be pruned
rather than carried forever.

**Priorities**
- P1: Must deal with before the book is considered ready
- P2: A good idea that will strengthen the book but isn't necessary to ship
- P3: Could take it or leave it

Each entry: date added, priority, note.



## Easy Adds

> Isolated additions or edits — good grabs when you have ~10 minutes and want a
> self-contained task instead of drafting new prose.

- **2026-07-11 — P2** — AI tools are very good at getting syntax right. It's
  still important for a programmer to understand and work with syntactically
  correct code, but the presence of AI relieves us of some of the ongoing
  struggle to get syntax exactly right. Worth a note (probably in the syntax
  section) naming this tension directly rather than ignoring it.

## Structural Notes

> Ideas that cross-cut multiple sections/chapters and might mean reorganizing,
> rewriting, or rearranging things — not isolated edits.

- **2026-07-19 — P3** — For a yet-to-be-planned chapter on libraries: use a
  sketch (e.g. the sunrise sketch) reaching out to theme the parent page as an
  advanced example. Since exercise sketches run in a sandboxed iframe, the clean
  way is a `postMessage` bridge — sketch posts a themed request (e.g. "set
  --bg-color to X"), parent listens and applies it to a CSS custom property —
  rather than direct DOM access across frames. Good vehicle for showing how a
  library (p5) interacts with the surrounding browser context once students have
  some JS/CSS grounding.

- **2026-07-25 - P2** — When a sketch times out, the current message "Press Run
  to see output" is not satisfying or helpful. It should say "Sketch stopped to
  save battery. Press Run to re-activate." or something to that effect - be sure
  the text fits in the available space.

## Other

> Ideas that don't clearly fit the above.

- **2026-07-19 — P2** — When reviewing `p5exercise`/`jsconsole` blocks, watch
  for `id`/`solutionTo` agreement, especially on solution blocks. Easy to typo a
  `solutionTo` value so it doesn't match the exercise's `id` (found and fixed
  one in conditionals.mdx: `english-to-code` / `english-to-code-sln`). Worth a
  pass checking these pairs match wherever a solution is offered.

- **2026-07-23 — P3** — Revisit upgrading to TypeScript 7 (native Go-ported
  compiler, now npm `latest`). Checked the actual 7.0.2 package: it's a breaking
  change, not a routine bump. `ts.transpileModule`/`createProgram` are gone
  entirely from the package — the real API now lives behind
  `./unstable/sync`/`./unstable/async`, a Node-only client that spawns a native
  OS binary (per-platform optional deps like
  `@typescript/typescript-darwin-arm64`). That means
  `immerse/src/workers/executor.worker.ts`, which runs `ts.transpileModule`
  inside a browser Web Worker to grade student code, has no upgrade path — a
  worker can't spawn a native process. Also `typescript-eslint` currently
  hard-caps its peer dep at `typescript >=4.8.4 <6.1.0`, so root lint tooling
  isn't compatible with 7.x yet either. Hold off until there's a browser-usable
  replacement for the transpile API and typescript-eslint supports 7.x.
