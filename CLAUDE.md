Always read the CLAUDE.md file at the beginning of sessions for establishing context.

The user will retain editorial control. Yours is a supporting role to provide feedback and criticism. You will also be asked to smooth out language, generate problems and problem sets.

## TODO list

`book/TODO.md` tracks deferred ideas the user notices while drafting but
doesn't want to act on immediately (to preserve momentum). It has three
sections — Easy Adds, Structural Notes, Other — each entry dated and given
a priority (P1/P2/P3). Check it when the user wants a quick, self-contained
task, and add to it when the user surfaces an idea they want to defer
rather than act on now.

## Exercise code blocks (`p5exercise`, `jsconsole`)

Every ` ```p5exercise ` or ` ```jsconsole ` code block must have a unique `id` attribute (e.g., `id="hello-world"`). IDs must be unique within a section and across the entire book. When adding or copying one of these blocks, always assign a new distinct ID — never duplicate an existing one.

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
