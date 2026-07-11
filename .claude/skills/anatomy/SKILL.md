---
name: anatomy
description: Use when the user asks to add, adjust, or fix a CodeAnatomy diagram in book .mdx content (e.g. "/anatomy", "add an anatomy diagram for this line of code", "the labels are overlapping, fix the layout") — authors or repositions immerse's canvas-based CodeAnatomy component using hand-picked pixel coordinates.
argument-hint: [target .mdx section] <what to show: the code snippet and which parts to label>
allowed-tools: [Read, Edit, Write, Glob, Grep, Bash]
---

# CodeAnatomy diagram authoring

Component: `immerse/src/components/CodeAnatomy.tsx` (import as
`import { CodeAnatomy } from "immerse/components/CodeAnatomy"`). Read its
doc comment for the current prop shapes before editing — it is kept in sync
with the component. There is no parsing of code text to find character
positions; every coordinate is a manual pixel guess on a `width`×`height`
canvas, refined by eye. Four calibrated, working examples already live in
`book/src/units/02-programming-languages/chapters/02-javascript/sections/02-syntax.mdx`
— read them first as ground truth before placing new coordinates.

## Instructions

1. Resolve the target `.mdx` section from `$ARGUMENTS` (a path, or nearby
   context in the conversation). If it's genuinely ambiguous which file or
   which existing diagram is meant, ask rather than guessing.
2. Determine whether this is a **new** diagram or an **edit** to an existing
   `<CodeAnatomy>` block already in that file (e.g. "fix the overlap",
   "move X"). For edits, read the existing block in full before changing it.
3. Prefer a **single-line** code snippet when it stays readable — flatten
   trivial multi-line constructs (e.g. an empty-body function as
   `function greet(name, timeOfDay) { }`, not a multi-line body). If the
   snippet is genuinely hard to read on one line (long `if/else`, a
   multi-statement body), put `\n` in `code.value` to break it across lines
   instead of cramming it onto one — the component supports this: each line
   starts at `code.pos.x` (so leading spaces indent it) and stacks downward
   at `fontSize * 1.35` px apart (override via `code.lineHeight`).
4. Compute pixel coordinates using the calibration derived from the four
   existing diagrams:
   - Monospace char width ≈ `fontSize × 0.5833` (fontSize 48 → 28px char
     width; fontSize 40 → 23.33px — both measured against real rendered
     output in this file).
   - A token's horizontal center: `code.pos.x + (startIndex + length/2) × charWidth`,
     where `startIndex`/`length` are measured within that token's own line
     (each line's index starts back at 0).
   - A label's target `y` for line N (0-indexed): `code.pos.y + N × lineHeight`
     (`lineHeight` = `code.lineHeight` or `fontSize * 1.35`), then apply the
     above/below offset below relative to that line's `y`.
   - Arrow target for a label sitting **above** the code line:
     `target.y = <that line's y> - 10`.
   - Arrow target for a label sitting **below** the code line:
     `target.y = <that line's y> + fontSize + 10`.
5. Lay out labels in a row at `pos.y: 10`, spaced evenly across `width`, with
   each `maxWidth` roughly `width / labelCount` minus a small gutter so
   adjacent label text blocks don't collide horizontally.
   - **Known failure mode, already hit once:** if a label's target points
     are far apart (e.g. matching open/close parens spanning most of the
     line), placing it in the top row makes its arrows cross through other
     labels' text. Fix: move just that one label to a second row *below*
     the code line (its own `pos.y`, well past `code.pos.y + fontSize`),
     using the below-the-line target offset from step 4. Leave every other
     label in the top row. Don't preemptively move every wide-span label —
     only ones that actually cross others once placed.
6. Use the array form of `target` — `target: [{x, y}, {x, y}]` — for any one
   label that marks a matching *pair* of characters (parens, curly braces,
   quotes): one label, one arrow per point, fanned out from the same box.
7. Wire it up:
   - Add `import { CodeAnatomy } from "immerse/components/CodeAnatomy"` at
     the top of the file if not already present.
   - Insert/replace the `<CodeAnatomy>` JSX block with `progressive` set
     (every existing diagram uses it) unless told otherwise.
   - Order the `labels` array in the sequence they should be explained —
     with `progressive`, that order is also the reveal order.
   - `CodeAnatomy` labels do not need unique IDs (unlike `p5exercise` /
     `jsconsole` fenced blocks, which do — see the root `CLAUDE.md`).
8. **Do not** try to start the dev server or open a browser to check the
   layout yourself. Coordinates here are always estimates — make your best
   placement using the formulas above, then ask the user to paste back a
   screenshot of the rendered page so specific coordinates can be nudged.
   This matches how every prior diagram in this file was actually tuned.
9. If you edited `CodeAnatomy.tsx` itself (not just `.mdx` content), run
   `npx tsc --noEmit -p immerse/tsconfig.json` before reporting done. A
   content-only `.mdx` change needs no build step.

## Reference example

One of the four calibrated diagrams already in `02-syntax.mdx`, for a
concrete worked pattern (top-row labels, mixed `maxWidth`, `-10` arrow
offset):

```mdx
<CodeAnatomy
  code={{
    value: 'const realName = "Margaret"',
    pos: { x: 22, y: 310 },
    fontSize: 48,
  }}
  width={800}
  height={380}
  progressive
  labels={[
    {
      name: "const",
      text: "Keyword that means we're introducing a variable that can't change values afterwards.",
      pos: { x: 20, y: 10 },
      target: { x: 92, y: 300 },
      maxWidth: 260,
    },
    {
      name: "realName",
      text: "The variable name we've chosen.",
      pos: { x: 300, y: 10 },
      target: { x: 302, y: 300 },
      maxWidth: 130,
    },
    {
      name: "Equals sign",
      text: "Indicates an assignment operation.",
      pos: { x: 450, y: 10 },
      target: { x: 456, y: 300 },
      maxWidth: 140,
    },
    {
      name: '"Margaret"',
      text: "String literal to be used as the constant's value.",
      pos: { x: 610, y: 10 },
      target: { x: 638, y: 300 },
      maxWidth: 170,
    },
  ]}
/>
```

For the below-the-line layout fix (paired-target label moved off the top
row), see the "Anatomy - Function Definition" diagram later in the same
file — its `Parentheses` label uses `target: [...]` and sits below the code
line while the other five labels stay in the top row.
