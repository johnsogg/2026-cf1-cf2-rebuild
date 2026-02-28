# Lesson POC — Plan

## Goal

This project is the second experiment in building an interactive "learn to code"
platform. The first experiment (`webworker-poc/`) proved that in-browser
TypeScript execution is feasible: a Monaco editor sends student code to a Web
Worker, which transpiles and runs it against hidden test assertions, and returns
structured pass/fail results — all without a server.

This experiment takes that primitive and builds toward the first real lesson: a
document where prose and executable code editors are interspersed naturally. The
authoring format is **MDX** (Markdown + JSX), which lets the author write
ordinary Markdown prose and embed interactive `<Exercise />` components inline.
The lesson reads like a textbook chapter; the code boxes are part of the flow,
not a separate tool.

Key decisions carried in from prior discussion:

- **MDX for authoring.** Lesson content lives in `.mdx` files. The author writes
  prose in Markdown and drops `<Exercise />` components where practice is
  needed.
- **Parametric Exercise component.** The component from `webworker-poc` was
  hardcoded. Here it must accept all exercise data as props so that any number
  of exercises can be embedded in a lesson.
- **Nominal exercise IDs.** Each exercise gets a stable string ID (e.g.
  `'init-person'`, `'while-loop-intro'`), not an ordinal position. This keeps
  IDs meaningful and decoupled from lesson order, which matters for future
  persistence.
- **Mobile strategy: punt on editing.** On phone breakpoints, interactive
  editors are replaced with a short "do this on a computer or tablet" message.
  Read-only, syntax-highlighted code blocks (for example code, not exercises)
  render normally on all screen sizes.
- **Test code is visible but secondary.** Students can see the test code if they
  look, but it is not the primary focus. The editor component should support a
  collapsed/expandable test pane; this is not on the critical path but should be
  architecturally possible.
- **Persistence is a later step.** The stable IDs are in place now so that
  future local-storage or API-based persistence can key off them without a
  migration.

### Exercise type extensibility

The platform must support multiple exercise types beyond code execution — at
minimum, multiple choice and numeric input. The type system uses a tagged union
(`type: "code" | "multiple-choice" | ...`). Each exercise type is responsible
for its own grading logic; there is no generic grading engine.

Completion state is a three-value model:

- `not_attempted` — the student has not interacted with the exercise
- `attempted` — the student has submitted an answer (applies to all types)
- `correct` — the answer was graded and is right (only meaningful where
  auto-grading is possible)

Exercises with substantial setup (e.g. a large option list, complex test
scaffolding) should live in separate files rather than inline in the MDX, to
keep the lesson prose readable.

### Progress tracking

Progress is **recorded at the exercise (leaf) level** and **derived at any
higher level** (section, chapter, unit, book). No rollup state is stored —
aggregate progress is always computed from the leaf records. This prevents stale
data and keeps the storage format simple.

The hierarchy is: book → unit → chapter → section → exercise. Each exercise's
stable ID encodes enough information to reconstruct where it sits in this
hierarchy (or IDs are namespaced accordingly).

### Local persistence

`localStorage` is the initial persistence mechanism. It is explicitly considered
brittle and temporary: the format will change as the system evolves, and early
users are expected to lose progress on breaking changes. This is acceptable
during active development. A server component will replace or supplement local
storage once the content is stable enough to warrant it. No external analytics
(e.g. PostHog) will be used at any point; FERPA compliance requires that usage
data stays under our control.



## Steps

### 1. Scaffold the project

Create a new Vite + React + TypeScript project in `lesson-poc/`. Install
dependencies: `@mdx-js/rollup`, `remark-gfm`, `@monaco-editor/react`, and
`typescript` (for the worker). This is the same stack as `webworker-poc` plus
MDX support.

### 2. Configure Vite for MDX

Add `@mdx-js/rollup` to `vite.config.ts` with `remark-gfm` enabled. Ensure the
MDX plugin runs before the React plugin (`enforce: 'pre'`). Verify that a
minimal `.mdx` file renders correctly before proceeding.

### 3. Define the Exercise type

Create `src/types.ts` with an `Exercise` type that includes `id` (nominal
string), `title`, `description`, `starterCode`, `testCode`, and `moduleName`
(the name the test file imports from — needed by the worker's `require()` shim).
All exercise data flows through this type.

### 4. Port the executor Web Worker

Copy `executor.worker.ts` from `webworker-poc/` and generalize the hardcoded
`require()` shim to accept `moduleName` from the incoming message rather than a
hardcoded list of aliases.

### 5. Build the parametric Exercise component

Extract the exercise UI from `webworker-poc/App.tsx` into
`src/components/Exercise.tsx`. The component accepts an `Exercise` prop and
manages its own editor state, worker lifecycle, and results display. It is fully
self-contained — multiple instances can coexist on a page without interfering.

### 6. Write the first lesson as an MDX file

Create `src/lessons/lesson-01.mdx`. Write a short but real lesson: a few
paragraphs of prose introducing a concept, then one or two `<Exercise />`
components, then more prose. Use the `initPerson`/`greet` exercise from the POC
as the first exercise. The goal is a document that reads naturally as a lesson,
not a demo.

### 7. Wire up the app shell

Replace `webworker-poc`-style `App.tsx` with a thin shell that imports and
renders `lesson-01.mdx`. The shell provides the `MDXProvider` with the component
mapping (so that, e.g., code blocks get syntax highlighting) and any page-level
layout (max-width, typography).

### 8. Mobile breakpoint handling

Add responsive CSS so that on phone-sized screens, the `<Exercise />` component
renders a short "this exercise requires a computer or tablet" message in place
of the editor. Verify that prose and any read-only code blocks still render
correctly at that breakpoint.

### 9. Smoke-test the end-to-end flow

Run the dev server and confirm: (a) prose renders correctly, (b) exercises are
interactive and run against the worker, (c) multiple exercises on the same page
don't interfere, (d) mobile breakpoint shows the fallback message. Fix any
issues before considering this POC complete.
