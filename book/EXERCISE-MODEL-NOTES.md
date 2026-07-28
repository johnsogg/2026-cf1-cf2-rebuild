# Exercise/prompt model — analysis notes

Working notes from a conversation auditing how interactive content is
actually authored across the book, ahead of deciding whether/how to unify
it behind a common interface. Observation only — no proposed design here.

## The dimensions (as the author framed them)

- **Presentation mode**: Illustration (absorb) vs. Prompt (do something)
- **Progress tracking**: is the item counted toward book-wide completion?
  What counts as "done" — seeing it, interacting with it, or passing a
  correctness check?
- **Prompt type**: `p5sketch` (output only, no code shown), `p5exercise`
  (code + output, editable), plain natural language ("make a thing that
  does XYZ")
- **Solutions**: optional peer element referring to a prompt by id, UI
  convention is to hide it in a `<details>` block

## Structural surprise (independent of the taxonomy question)

`registerExerciseInSection` (`immerse/src/progress/ProgressContext.tsx:52-64`)
fires the instant an `Exercise` mounts — presence alone earns a slot in
that section's completion list, regardless of intent.

`Exercise.tsx`'s `ExerciseContent` only forwards `onAttempt`/`onComplete`
into the `"code"` and `"multiple-choice"` cases. The `"p5"` and `"console"`
cases (i.e. every `p5exercise`/`jsconsole` block) never receive those
callbacks at all, so their attempt state can never leave `"idle"`.

Net effect: any `p5exercise`/`jsconsole` block registers toward progress
tracking but can never be marked attempted/complete, which means any
*section* containing one can never show as `"attempted"` or `"complete"`
in `getSectionStatus` (`ProgressContext.tsx:12-27`), no matter what the
reader does. This is true across all five patterns below — it isn't
specific to any one of them.

For contrast: `CodeExercise` and `MultipleChoiceExercise` *do* get real
`onAttempt`/`onComplete` wiring (test-pass / correct-choice), so
completion semantics already silently fork by prompt type today, not by
anything the author declares.

## Combinations actually in use, verified against source

**1. Pure illustration, not tracked, no solution**
`02-gray-dot.mdx:7-17` — `p5sketch`, no `id`, no ask. Correctly invisible
to progress tracking since it isn't an `Exercise` at all.

**2. Same content, re-fenced as an exercise — tracked, completion
unreachable, no solution**
`03-hello-world.mdx:7` — literally the same gray-dot code, now
`p5exercise id="gray-dot"`. Prose explicitly says "play around" — no
task — but it silently registers into progress the moment it renders, and
per the bug above can never register as done. Also reuses `id="gray-dot"`,
duplicated again at `02-syntax.mdx:271` (book-wide id uniqueness rule
violated, currently harmless since neither is a `solutionTo` target).

**3. Formal task, blank starter, solution — but wrong target**
`04-p5-graphics.mdx:205` (`fill-stroke-thickness`, "See if you can
replicate this...") is followed at `:219` by a solution whose
`solutionTo="style-circles"` — the id of an *earlier illustration block*,
not this exercise. The reader gets no numbered link back to the task they
actually did.

**4. Comprehension prompt where the "ask" itself can't be an anchor**
Reader is shown a `p5sketch` and asked to explain/replicate it, given a
separate blank `p5exercise` to work in (e.g. `graphics-reading-replicate`,
`if-what-you-see`). `remarkP5Sketch.ts` never parses an `id=` out of the
fence meta at all — so even if the author wrote one in, `solutionTo`
could never target the sketch itself; the plugin drops it before it
reaches the component.

**5. Open-ended creative prompt, ask buried in a code comment, "solution"
is really the author's own worked example**
`04-p5-graphics.mdx:756-799` (`graphics-scene`, starter says `// your
shapes here`) → solution reveal contains a narrated prompt ("A bear
walking through the forest at sunrise"), a hand-drawn image, and one
worked interpretation — not a grading key, more "here's what I made."
Also dangling: `solutionTo="p5-graphics-scene"` vs. the real id
`graphics-scene`.

## Known dangling/incorrect `solutionTo` links found in this pass

- `04-p5-graphics.mdx:572` — `solutionTo="graphics-style-state-id"`, real
  id is `graphics-style-state` (typo).
- `04-p5-graphics.mdx:782` — `solutionTo="p5-graphics-scene"`, real id is
  `graphics-scene` (typo).
- `04-p5-graphics.mdx:219` — `solutionTo="style-circles"` points at a real
  block, but the wrong one (an illustration, not the exercise it follows).
- Duplicate `id="gray-dot"` — `01-code-as-creative-tool/.../03-hello-world.mdx:7`
  and `02-programming-languages/.../02-syntax.mdx:271`.

None of these were fixed as part of this pass — they're leaf-layer bugs,
independent of whatever the taxonomy/component redesign ends up being.

## Update: architecture built (see `/Users/gabe/.claude/plans/vast-drifting-petal.md`)

The `<Ask>`/`<Solution>` design discussed above is implemented:
`immerse/src/components/Ask.tsx` and `Solution.tsx` replace the old
`Exercise.tsx` dispatcher; `CodeExercise`/`MultipleChoiceExercise`/
`P5Exercise`/`ConsoleExercise` are now pure presentation with no `id`.
Modes are `untracked`/`interacted`/`graded`, each with its own completion
semantics (see root `CLAUDE.md`). Every combination is demoed in
`book/src/misc/custom-renderers.mdx`.

**Explicitly deferred, not done in this pass:**

- Migrating the existing `p5exercise`/`jsconsole`/solution content across
  chapters (the ~25+ instances and 4 bugs catalogued above) to the new
  `Ask`/`Solution` shape — old content still uses the pre-`Ask` fence
  conventions until migrated section by section.
- Cross-file duplicate-`Ask`-id detection (the duplicate `gray-dot` id
  above is exactly this case) — the live warning banners built in this
  pass only catch same-page mistakes (a `graded` `Ask` with nothing
  gradable inside, an orphaned `Solution`); a book-wide id index would
  need to extend `exerciseCountPlugin.ts`'s static scan.

## Update: both deferred items done (2026-07-27)

**Migration.** All five old-style files (`02-gray-dot.mdx` needed no
change — it's pure `p5sketch` illustration, already correct) now use
`<Ask>`/`<Solution>`:

- `03-hello-world.mdx`, `01-variables-data.mdx`, `02-syntax.mdx`,
  `03-conditionals.mdx`, `04-p5-graphics.mdx` — every `p5exercise`/
  `jsconsole` fence wrapped in `<Ask id="..." mode="...">`; every
  `<details><summary>solution</summary>...</details>` replaced with
  `<Solution id="...">` (see below — `Solution` now owns its own reveal).
  All four dangling/incorrect `solutionTo` bugs catalogued above are fixed
  by construction (id lives once, on the `Ask`; `Solution` just reuses it).
- `mode` was chosen per block from the surrounding prose: explicit
  "try this"/"see if you can" language → `interacted`; pure demo with no
  ask of the reader → `untracked`. No `graded` candidates in this batch —
  none of this content has unit tests or multiple-choice.
- The two reused-`gray-dot` collisions resolved differently based on
  intent: `03-hello-world.mdx`'s copy is a real "play with it" moment →
  became a distinctly-`id`'d `interacted` `Ask`. `02-syntax.mdx`'s copy is
  pure "recall this from earlier" with no task → converted from
  `p5exercise` to a non-editable `p5sketch` illustration instead, so it
  needs no `Ask`/id at all (matches the doc's pattern 1: pure illustration,
  not tracked).
- Also fixed while migrating: `03-conditionals.mdx`'s `if-what-you-see` and
  `04-p5-graphics.mdx`'s `graphics-reading` fences had attributes from the
  *other* fence type on them (`p5exercise` with `autoplay width=/height=`,
  and `p5sketch` with `autorun size=`) — neither plugin parses the other's
  attributes, so both silently no-op'd. Fixed to the attributes each
  plugin actually reads.
- Not fixed (flagged in `book/TODO.md` instead, since it's a content call,
  not structural): `04-p5-graphics.mdx`'s "nested push/pop" example is
  byte-identical to the non-nested one above it — doesn't actually
  demonstrate nesting.

**`Solution` reveal.** Originally this doc anticipated authors hand-wrapping
`<Solution>` in `<details><summary>`. Instead `Solution` now owns the
`<details>` internally — an `exposeText` prop customizes the summary label
(default "Click here to show solution"), prefixed with "Solution to N"
when paired to a real `Ask`. The orphaned-`Solution` warning banner stays
outside the collapse (always visible), rather than being hidden behind a
click.

**Duplicate-id detection.** `exerciseCountPlugin.ts` now extracts literal
`id="..."` values (skipping `id={expr}` forms it can't resolve statically,
e.g. `CodeExercise`'s `id={someExercise.id}`) from every `<Ask>` tag across
all section files, and `console.warn`s at build/dev time if the same id
appears in more than one file. Verified against the full migrated book
(28 `Ask` tags, 26 static ids, 0 duplicates) and against a synthetic
duplicate to confirm it actually fires.
