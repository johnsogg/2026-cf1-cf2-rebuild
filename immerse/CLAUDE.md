# immerse — Component Reference

Custom components in `src/components/`, imported into book `.mdx` sections as
`import { X } from "immerse/components/X"`. Quick-lookup index of what's
available and when to reach for it - usage details live as doc comments in
each component's file, since those only matter once you've already decided
to use it.

Most of these are registered on the `MDXProvider` (in `ImmerseApp.tsx` and/or
`book/src/App.tsx`) and so are usable in any book `.mdx` section with **no
import** — noted per component below. The rest need the explicit
`import { X } from "immerse/components/X"` shown in their doc comment.

- **CodeAnatomy** - Canvas diagram labeling parts of a code snippet with
  arrows (e.g. "this is the variable name"). Use when introducing new
  syntax and prose alone won't clearly call out each token's role. Optional
  `progressive` prop steps through labels one at a time. Needs an import.

- **Callout** - Colored aside box (`<Callout intent="note">...</Callout>`)
  for warnings, fun facts, or questions posed to the reader. Registered
  globally on the MDXProvider in `book/src/App.tsx`, so no import needed
  (some sections still import it explicitly — both resolve to the same
  component).

- **ExpectedReadTime** - "N min" badge driven by a section's word count.
  Must be written exactly as `<ExpectedReadTime wordCount={wordCount} />`;
  a remark plugin injects `wordCount` into the page at build time. No
  import needed.

- **P5Sketch** - Non-editable p5.js sketch rendered in a sandboxed iframe,
  for showing pre-written examples inline. Give it `code` (usually
  imported from a `.ts` file). No import needed. For short one-off
  snippets, use a ` ```p5sketch autoplay width=300 height=100 ` fenced
  code block instead of a source file + JSX.

- **Ask** / **Solution** - `<Ask id="..." mode="untracked" | "interacted" | "graded">`
  wraps any content (prose, a sketch, an editor, a mixture) and owns
  identity, numbering, the completion-state indicator, reset, and hints —
  independent of what's rendered inside. `<Solution id="...">` pairs with
  an `Ask` by reusing its id (not a second one). Both live in `Ask.tsx`/
  `Solution.tsx` and render a live in-page warning banner for the two
  structural mistakes that used to fail silently: `mode="graded"` wrapping
  content that can't report a grade, and a `Solution` with no matching
  `Ask` on the page. No import needed. See root `CLAUDE.md` for the
  authoring convention.

- **CodeExercise**, **MultipleChoiceExercise**, **P5Exercise**,
  **ConsoleExercise** - Pure presentation, always used inside an `Ask`
  (never standalone): `CodeExercise` (Monaco + unit tests, reports a real
  grade), `MultipleChoiceExercise` (single-answer, reports a real grade),
  `P5Exercise` (editable sketch, visual only, no grading),
  `ConsoleExercise` (editable JS/TS, plain `console.log` output, no
  grading). They read their storage-key `id` from the wrapping `Ask` via
  `useAsk()`, not from their own props. No import needed. The
  `p5exercise`/`jsconsole` fenced code blocks are shorthand for
  `P5Exercise`/`ConsoleExercise` inline — they carry no
  `id`/`title`/`solutionTo` of their own.

- **Term** (from `Glossary.tsx`) - Marks an inline term
  (`<Term>recursion</Term>`) that pops up its glossary definition on
  click, sourced from the `glossaryEntries` passed to `ImmerseApp`. Renders
  with an obvious "missing" style if no matching entry exists yet. No
  import needed.

- **Kbd** - Renders a platform-aware keyboard shortcut, e.g.
  `<Kbd mod>Enter</Kbd>` or `<Kbd op="save" />`; switches between Mac/Windows
  glyphs client-side. `op` looks up named shortcuts from the active
  `KbdProvider` map. No import needed.
