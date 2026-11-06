Always read the CLAUDE.md file at the beginning of sessions for establishing
context.

The user will retain editorial control. Yours is a supporting role to provide
feedback and criticism. You will also be asked to smooth out language, generate
problems and problem sets.

## External homework repositories

The AABB homework in CF1 (and probably every homework in CF2) lives in separate
git repos, not in this book. This repo holds only the book-side content: the
`description.mdx` / `worked-examples.mdx` under
`book/src/units/homework/chapters/<homework>/`. The code, tests, and autograding
live elsewhere. AABB was traditionally the 2nd homework in the data structures
course, after an initial "git + local editing" homework about how to get and
finish homework.

### How homework and grading work

- Each homework has a **private prime repo** `codezeug/hw-<name>-private` (holds
  the `solution` branch and full history; never shown to students) and a
  **public template** `codezeug/hw-<name>` (a single-commit, history-free
  snapshot of the prime repo's `main`). One public template serves both CF1 and
  CF2 (aabb is the only planned CF1 assignment so far).
- Students click "Use this template" to make a **private** repo in their own
  account, install the GitHub App `codezeug-graderbot`
  (https://github.com/apps/codezeug-graderbot) on just that repo, run
  `npm run check-setup` to verify, then edit, test locally with npm, and push.
  Student repos must stay private.
- Grading is done by the private repo `codezeug/grader`: a GitHub Actions matrix
  with one job per student repo. Each job checks out the student's repo at a
  pinned SHA, overlays the pristine tests/config from the prime repo, and runs
  the tests on a GitHub-hosted runner (so student code never runs on
  instructor/TA machines). The grader reads repos through the App, not
  collaborator invites. The grader finds a student's repo by GitHub's
  `template_repository` field (the `templates` list in `homeworks.json`; quiet
  fallback: package.json name `hw-<name>`), so students must use "Use this
  template"; what they name their repo doesn't matter.
- Cheating/AI-use detection is explicitly out of scope, and students modifying
  tests is not treated as suspicious. Scale: ~30-40 students x ~10 homeworks per
  semester.
- `check-setup` reads https://codezeug.github.io/grader/installations.json
  (published by the grader repo every ~2 hours, hashes only), so it can wrongly
  report "not installed" for up to ~2 hours after a student installs the App;
  the script says so.

### Where things live (local paths; GitHub org is `codezeug`)

- `~/courses/2026-cf1-cf2-rebuild` — this book repo (homework descriptions and
  worked examples only, under `book/src/units/homework/`).
- `~/courses/2026-cf1-cf2-rebuild/scripts/publish-template.sh` — publishes the
  public `hw-<name>` from `hw-<name>-private`:
  `scripts/publish-template.sh hw-<name>-private [--execute]` (dry run unless
  `--execute`). It finds the private repos at `../cf2-private` relative to this
  book repo and says so if that directory is missing. It refuses to overwrite a
  non-public target and refuses snapshots with solution-looking paths.
- `~/courses/cf2-private/` — a plain directory, **not a git repo**, holding:
  - `hw-<name>-private/` — one git repo per homework (remote
    `git@github.com:codezeug/hw-<name>-private.git`): aabb, bst, bubbles,
    collide, fsm, graph, hash, huffman, linked-lists, using-git. Each has a
    `solution` branch.
  - `hw-template/` — template repo for starting a new homework, plus its setup
    `__checklist.md`. Not a homework itself, so no `-private` suffix.
  - `grader/` — local clone of the private `codezeug/grader` repo: roster
    (`roster.csv`: `email,github,ta,section,name`, keyed on Canvas email; `ta`
    is the grading TA's slug and `section` is the university code like
    `ATLS 1300-112`), `staff.csv` (teaching team, sections, times),
    `homeworks.json`, the plan/test/collect grading workflow, and the
    installations-list publisher. Its README has the one-time setup, how to
    grade, and the TA flow (`./grade --hw aabb --ta lucky`, driven by the
    roster's `ta` column; before giving TAs write access, move the app key into
    the `grading` environment and protect `main`).
  - `enter-grades.sh` — grade entry helper; `js-refresher-jan-2*`, `exams/`,
    `slides/`, `lectures/`, `schedule-2026-spring.md` — other course material.
- GitHub App: `codezeug-graderbot` (settings:
  https://github.com/organizations/codezeug/settings/apps/codezeug-graderbot).
  App ID is 5622546 (not secret; hard-coded in the grader workflows). The
  private key lives only as the grader repo's Actions secret `APP_PRIVATE_KEY`
  and is never committed or pasted into chat. The App is installed on the
  `codezeug` org for the prime `hw-*-private` repos (selected repos only).

### Current status (2026-11-05)

The repos use the `-private` scheme, the public `codezeug/hw-aabb` is published,
and the whole pipeline is verified against it (a pretend-student repo made from
`hw-aabb` scored as expected via `./grade --hw aabb --all`; the App installation
survived the renames). Note that the grader runs from the copy on GitHub: push
`grader` changes (e.g. `homeworks.json`) before running `./grade`. Still to do:
republish `hw-aabb` whenever `hw-aabb-private` changes (the public repo is a
snapshot), port the same flow to the other homeworks (each needs the App
installation, a `homeworks.json` entry, and a publish), and write the book
prose. The roster is filled in; six students still owe the instructor their
GitHub username.

### Per-homework reminders

The user wants these surfaced proactively: when a new `hw-*-private` repo is
created, add it to the `codezeug-graderbot` App installation on the `codezeug`
org, add it to the grader's `homeworks.json`, and make sure the `solution`
branch/history is never reachable from the public template students copy
(publish only via the script). Every `hw-*-private` repo has a `solution` branch
and should be private.

When working on a homework, read the external repo by absolute path rather than
assuming it is in this repo; edits there need their own commits/pushes.

## TODO list

`book/TODO.md` tracks deferred ideas the user notices while drafting but doesn't
want to act on immediately (to preserve momentum). It has three sections — Easy
Adds, Structural Notes, Other — each entry dated and given a priority
(P1/P2/P3). Check it when the user wants a quick, self-contained task, and add
to it when the user surfaces an idea they want to defer rather than act on now.

## Ask / Solution (presentation vs. progress tracking)

Content (a `p5exercise`/`jsconsole` fence, a `CodeExercise`/
`MultipleChoiceExercise`, plain prose, an image, any mixture) is always wrapped
in `<Ask id="..." mode="untracked" | "interacted" | "graded">`. The
fence/component itself carries no `id`, `title`, or `solutionTo` — identity and
chrome (question number, reset, completion indicator) belong to the wrapping
`Ask`, not the content:

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

Your paragraph, with <Term>whatever</Term> JSX inline, all as one block with no
blank line inside it.

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

Vite fingerprints/copies the file at build time and rewrites the `src`, so this
works correctly under both dev and the GitHub Pages base path without any manual
`import.meta.env.BASE_URL` handling. Set an explicit `width` (or CSS) to size
the image — Vite doesn't generate responsive variants on its own. If chapters
start needing resizing/`srcset` at scale, revisit adding `vite-imagetools`
rather than resizing images by hand.
