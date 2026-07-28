Always read the CLAUDE.md file at the beginning of sessions for establishing context.

The user will retain editorial control. Yours is a supporting role to provide feedback and criticism. You will also be asked to smooth out language, generate problems and problem sets.

## TODO list

`book/TODO.md` tracks deferred ideas the user notices while drafting but
doesn't want to act on immediately (to preserve momentum). It has three
sections — Easy Adds, Structural Notes, Other — each entry dated and given
a priority (P1/P2/P3). Check it when the user wants a quick, self-contained
task, and add to it when the user surfaces an idea they want to defer
rather than act on now.

## Ask / Solution (presentation vs. progress tracking)

Content (a `p5exercise`/`jsconsole` fence, a `CodeExercise`/
`MultipleChoiceExercise`, plain prose, an image, any mixture) is always
wrapped in `<Ask id="..." mode="untracked" | "interacted" | "graded">`.
The fence/component itself carries no `id`, `title`, or `solutionTo` —
identity and chrome (question number, reset, completion indicator) belong
to the wrapping `Ask`, not the content:

```mdx
<Ask id="hello-world-colors" mode="interacted" title="Try it">

```p5exercise size="small" autorun
function setup() {
  createCanvas(150, 150)
}
```

</Ask>
```

- **`untracked`** — doesn't count toward book completion; still gets a
  number so it shows up in the compiled exercise index. Use for
  illustration/asides you still want indexable.
- **`interacted`** — a standard checkbox `Ask` renders itself; checking it
  is the only completion signal. Use for informal "try this" prompts,
  including plain prose with no widget at all.
- **`graded`** — real correctness signal (unit-test pass / right answer).
  Only content that can report a grade (`CodeExercise`,
  `MultipleChoiceExercise`) works here — wrapping ungradable content (a
  `p5exercise`/`jsconsole`) in `mode="graded"` renders a live warning
  banner on the page itself, not just a build log message.

`<Solution id="...">` pairs with an `Ask` by **reusing its id** — never
invent a second id for the solution. IDs must still be unique
book-wide across every `Ask`. If a `Solution`'s id has no matching `Ask`
on the page, that also renders a live warning banner instead of silently
doing nothing.

See `book/EXERCISE-MODEL-NOTES.md` for the audit that motivated this and
what's still deferred (migrating older content, cross-file duplicate-id
detection).

## Inline JSX in prose paragraphs (e.g. `<Term>`)

Prettier's MDX parser (with `proseWrap: "always"` from `.prettierrc`) has a bug:
if a JSX tag like `<Term>` ever ends up as the first character of a line —
which its own auto-wrapping can cause — it misreads that as the start of a new
block on the *next* save, permanently splitting one paragraph into two (with an
unwanted blank line/visual gap in the rendered book). This is a Prettier-only
bug; the real `@mdx-js/mdx` compiler used at build time parses the same
single-newline source correctly as one paragraph.

If a paragraph contains inline JSX and is at risk of this (mainly: it's long
enough to wrap, or already has a JSX tag mid-sentence), protect it by wrapping
the whole paragraph in MDX comment markers, each isolated by blank lines so
Prettier sees them as standalone flow nodes rather than gluing them into the
paragraph text:

```
{/* prettier-ignore-start */}

Your paragraph, with <Term>whatever</Term> JSX inline, all as one block with
no blank line inside it.

{/* prettier-ignore-end */}
```

Do NOT use `<!-- prettier-ignore -->` (HTML comment syntax) — it's not valid
MDX and breaks the real build, even though Prettier itself accepts it.

## Images in chapters

No image-processing plugin is installed (no `vite-imagetools`, `sharp`,
etc.) — images go through Vite's plain static-asset pipeline.

Convention: co-locate images in an `assets/` folder next to the `.mdx`
section file, then import and render them:

```mdx
import mySketch from "./assets/my-sketch.jpg"

<img src={mySketch} alt="..." width={300} />
```

Vite fingerprints/copies the file at build time and rewrites the `src`, so
this works correctly under both dev and the GitHub Pages base path without
any manual `import.meta.env.BASE_URL` handling. Set an explicit `width` (or
CSS) to size the image — Vite doesn't generate responsive variants on its
own. If chapters start needing resizing/`srcset` at scale, revisit adding
`vite-imagetools` rather than resizing images by hand.
