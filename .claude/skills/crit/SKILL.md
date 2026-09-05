---
name: crit
description: Use when the user runs `/crit` for targeted editorial feedback (accuracy, style, or both) on a book .mdx file — ranks findings by severity so only the most actionable items surface first, instead of a giant batch.
argument-hint: <accuracy|style|all> [file path]
allowed-tools: [Read, Grep, Glob, Bash]
---

# /crit — ranked editorial feedback

Purpose: short, prioritized feedback the user can act on immediately and
then re-run the command, not an exhaustive one-shot audit. The user retains
editorial control (see root `CLAUDE.md`) — this command gives feedback and
criticism, it never rewrites the user's prose itself.

## Resolve arguments

`$ARGUMENTS` may contain a mode and/or a file path, in either order.

- **Mode**: `accuracy`, `style`, or `all`. If no valid mode is given, ask
  which one before doing anything else — don't guess or default to one
  silently.
- **File**: an explicit path if one is given; otherwise the file currently
  open in the IDE or already under discussion in the conversation. If
  neither is available, ask.

`all` is a deliberate, heavier pass the user runs once they're already
happy with a page overall, as a final check — not a casual default. Run
both checks below independently when it's selected; don't collapse them
into one diluted pass.

## What each form checks

- **accuracy** — factual/technical assertions that are practically wrong: a
  claim about language semantics, a coordinate system, math, or terminology
  that would mislead a student or produce wrong code if acted on. Skip
  pedantic gotchas — things that are technically imprecise but true in
  spirit, or edge cases no reasonable reading would trip over. When in
  doubt, cut it rather than report it. Also covers mechanical errors in the
  same spirit: misspellings, doubled words (e.g. "is is"),
  missing/duplicated words, punctuation slips, inconsistent capitalization
  of the same term. Skip anything that's a phrasing/style choice rather
  than an actual error.
- **style** — pacing, clarity, tone, redundancy, sentence-level flow. Read
  it as a student encountering the page for the first time. Don't touch
  factual correctness here.
- **all** — run both passes above independently, then merge into one
  ranked list before applying the cut below (don't let one category crowd
  out the other in the final top-5).

## Rank, then cut

Privately rank every piece of feedback found:

- **egregious** — actively wrong or misleading in a way that would confuse
  or embarrass if left in: a factual error a student would internalize
  wrong, a typo that changes meaning, a jarring clarity failure.
- **important** — a real, worth-fixing issue, but not urgent.
- **nuanced** — true but minor; a polish-level nit.

Then decide what to report:

- If any **egregious** items exist, report only those — nothing else,
  regardless of category or count.
- Otherwise, report up to 5 items total: fill from **important** first,
  then **nuanced** to round out the five. Drop the rest silently — don't
  mention that more were found.

For `all` mode, apply this cut across the merged list from all three
passes, not separately per category.

## Output

Match the tone the user responded well to: a tight list, one finding per
bullet, plain language, `file:line` reference where useful. No preamble, no
summary paragraph, no restating the whole file back. For `all` mode, a
short heading per category is fine, but the 5-item budget above still
applies across the whole response, not per category. Do not fix anything
unless separately asked.
