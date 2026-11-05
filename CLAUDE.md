Always read the CLAUDE.md file at the beginning of sessions for establishing context.

The user will retain editorial control. Yours is a supporting role to provide feedback and criticism. You will also be asked to smooth out language, generate problems and problem sets.

## External homework repositories

The AABB homework in CF1 (and probably every homework in CF2) lives in
separate git repos, not in this book. This repo holds only the book-side
content: the `description.mdx` / `worked-examples.mdx` under
`book/src/units/homework/chapters/<homework>/`. The code, tests, and
autograding live elsewhere:

- GitHub org `codezeug` holds the pristine ("prime") copies, e.g.
  `codezeug/hw-aabb` and `codezeug/hw-template` (the template and its setup
  checklist). Local clones are in `~/courses/cf2-private/hw-*`. (`~/code/gen-homework-workflow`
  is the older CLI that turned `autograde.json` into a GitHub Classroom workflow.)
- AABB was traditionally the 2nd homework in the data structures course, after
  an initial "git + local editing" homework about how to get and finish homework.
- GitHub Classroom is sunset. Assignments stay on GitHub, but students fork the
  repo, run the tests locally via npm scripts, and push to their fork; grading
  uses our own mechanism instead of Classroom. Decided (2026-11-04): a central
  instructor-owned grader repo in the `codezeug` org (GitHub Team, educator
  discount, $0) runs a GitHub Actions matrix, one job per student repo. Each job
  checks out the student's private repo at a pinned SHA, overlays the pristine
  tests/config from the prime repo, and runs the tests on a GitHub-hosted
  runner (so student code never runs on instructor/TA machines). Student repos
  must stay private. Cheating/AI-use detection is explicitly out of scope, and
  students modifying tests is not treated as suspicious. Scale: ~30-40
  students x ~10 homeworks per semester. Students use "Use this template" to
  make a private repo in their own account, then install the GitHub App
  `codezeug-graderbot` (https://github.com/apps/codezeug-graderbot) on just
  that repo; the grader reads repos via the App, not collaborator invites. The
  App is installed on the `codezeug` org for the prime `hw-*` repos (selected
  repos only; add each new homework repo). In-progress work is in
  `~/courses/cf2-private/hw-aabb` (Classroom removed; `scripts/check-setup.mjs`
  added). Still to build: the private `codezeug/grader` repo (publish
  installations.json of sha256("owner/repo") hashes, grading matrix, CSV).
- Classroom-generated student forks were archived (to `codezeug-archive`) and
  deleted from `codezeug` on 2026-10-24.

Where things live (local paths; GitHub org is `codezeug`):

- `~/courses/2026-cf1-cf2-rebuild` — this book repo (homework descriptions and
  worked examples only, under `book/src/units/homework/`).
- `~/courses/cf2-private/` — a plain directory, **not a git repo**, holding:
  - `hw-<name>/` — one git repo per homework (private prime repos, remote
    `git@github.com:codezeug/hw-<name>.git`): aabb, bst, bubbles, collide, fsm,
    graph, hash, huffman, linked-lists, using-git. Each has a `solution` branch.
  - `hw-template/` — template repo and `__checklist.md` (still describes the
    old Classroom flow; update it when porting from `hw-aabb`).
  - `publish-template.sh` — publishes a public `cf1-`/`cf2-` template from a
    `hw-` repo (not versioned anywhere yet).
  - `archive-student-repos.sh`, `delete-archived-originals.sh`,
    `archive-until-done.sh`, logs/TSV — 2026-10-24 Classroom cleanup.
  - `enter-grades.sh` — existing grade entry helper.
  - `cf2-axis-aligned-bounding-boxes-hw-aarb/`, `cf2-huffman-coding-hw-huffman/`
    — old Classroom-era copies; `js-refresher-jan-2*`, `exams/`, `slides/`,
    `lectures/`, `schedule-2026-spring.md` — other course material.
- `~/courses/cf2-private/grader/` — planned local dir for the (private)
  `codezeug/grader` repo; not created yet.
- `~/code/gen-homework-workflow` — old CLI that generated Classroom workflow
  YAML from `autograde.json`. Obsolete under the new design.
- `~/code/codezeug-ts-template`, `~/code/hw-01-aabb-johnsogg` — 2024 prototypes
  of the TS homework template and the AABB homework; superseded by
  `cf2-private/hw-template` and `cf2-private/hw-aabb`.
- GitHub App: `codezeug-graderbot` (settings:
  https://github.com/organizations/codezeug/settings/apps/codezeug-graderbot,
  public page: https://github.com/apps/codezeug-graderbot). The private key and
  App ID go in the grader repo's Actions secrets `APP_ID` / `APP_PRIVATE_KEY`
  and are never committed or pasted into chat.

Repo naming: private prime repos are `hw-<name>` (hold the `solution` branch and
full history; the grader App is installed on these). Public student-facing
templates are `cf1-<name>` / `cf2-<name>`, published as single-commit
history-free snapshots of the private repo's `main` by
`~/courses/cf2-private/publish-template.sh hw-<name> cf1|cf2 [--execute]`.
The same `hw-` repo can publish to both (aabb is both cf1-aabb and cf2-aabb;
it is the only planned cf1 assignment so far).

Per-homework reminders (the user wants these surfaced proactively): when a new
`hw-*` repo is created, add it to the `codezeug-graderbot` App installation on
the `codezeug` org, and make sure the `solution` branch/history is never
reachable from the public template students copy. Every `hw-*` repo has a
`solution` branch; all `codezeug/hw-*` repos were private as of 2026-11-04.

When working on a homework, read the external repo by absolute path rather
than assuming it is in this repo; edits there need their own commits/pushes.

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
