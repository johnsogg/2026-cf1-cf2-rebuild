# CF1/CF2 Curriculum Planning — Conversation Summary

## Context

Instructor with 4 semesters of experience teaching two sequential courses:

- **CF1 (Computational Foundations 1):** Inherited curriculum, YouTube-based, not professionally informed. Instructor's approach: introduce programming through creative, interactive projects in p5.js (art, games, storytelling). Goal: develop interest in programming.
- **CF2 (Computational Foundations 2):** Instructor-developed curriculum, adapted from prior CS department work, implemented in TypeScript. Covers data structures and algorithms (linked lists, BSTs, stacks, queues, graphs, FSMs, hash tables) using real tools (CLI, Git, NPM, Jest). Goal: develop deeper, intuitive understanding of how software works.

Course materials uploaded to this project: CF2 planning doc, CF2 lecture notes (108 pages), Exam 1 from Spring 2025 and Spring 2026.

---

## Core Problem

Students are not arriving at CF2 with sufficient foundation. Specific failure modes:

- **Vocabulary gap:** Students misuse basic terms like "function," "traverse," and "invariant" in baffling ways on exams.
- **Conceptual scaffolding gap:** CF1 teaches by feel and imitation. Students learn to make things but never have to describe or explain what their code does.
- **The bridge:** CF1 is "happy fun time, make interactive art." CF2 requires fluency with details. The transition is too abrupt.

The AI problem compounds this: students use LLMs and autocomplete to pass assignments without building genuine understanding. They are passive consumers of information, not active constructors of knowledge. In-person, on-paper exams are already being used as a partial countermeasure.

---

## Proposed Direction: Two-Part Restructure

### Part 1 — Restructure the CF1→CF2 Arc

Redistribute foundational concepts currently only in CF2 back into CF1, but delivered in CF1's creative, low-stakes context. Key moves:

- Keep CF1's energy and creative project focus.
- Add lightweight "explain this code" / "predict what happens" components to existing CF1 assignments — no new content, just a new lens that builds vocabulary in context.
- Define a **minimum precision floor** for CF2 entry: what would a CF2 day-one diagnostic actually test? That becomes CF1's exit criteria.
- Use two cohorts of CF2 exam/homework data to identify where students consistently show up unprepared — that's the redistribution list.

Potential CF1 addition: value vs. reference variables, functions as first-class concepts, basic vocabulary used accurately. These are teachable in a p5.js context.

### Part 2 — Better Course Materials (Practice Environment)

The "interactive textbook" idea, reframed: not a textbook, but a **practice environment** — low stakes, repeatable, feedback-rich, grounded in realistic scenarios. Like a flight simulator for code comprehension.

Example: a module on value vs. reference that asks "what happens to x after this function runs?" ten different ways, with immediate feedback. Builds intuition that reading never could, and builds vocabulary in context.

Constraints and honest risks:
- Hand-authoring scenarios is expensive; LLMs can help generate them but output quality needs oversight.
- Passive students will engage with interactive systems passively too (clicking through) unless the design makes passive engagement unrewarding.
- **Incremental testing is essential.** Don't build a 1000-hour system before validating that students actually use it.

The 108-page CF2 lecture notes are a potential content base for this.

---

## Instructor Constraints

- ~1 hour/day before day job (full-time full-stack AI engineer)
- Not starting from scratch: years of existing materials
- LLM leverage available
- Constructivist pedagogical orientation

**Recommended sequencing:** Restructure the arc on paper first (low effort, high signal). This identifies the actual material gaps before committing to building anything new.

---

## Tooling Discussion

Current friction: web chat has searchable conversation history but no filesystem access; Claude Code has filesystem access but no persistent searchable history.

**Cowork** (Anthropic, research preview, January 2026) addresses this:
- Built into the Claude Desktop app (macOS and Windows)
- Give Claude access to a designated local folder; it can read, edit, and create files there
- Conversation history stored locally
- Available on all paid plans (Pro, Max, Team, Enterprise)
- Tradeoff: local history is not searchable the way claude.ai web chat is

Plan: use Cowork for artifact-heavy sessions (building materials), web chat for planning/thinking conversations.

---

## Open Questions / Next Steps

1. What does the CF2 day-one diagnostic actually look like? (Defines CF1 exit criteria)
2. What do two cohorts of exam/homework data say about the most consistent gaps?
3. Student workshop idea: have CF2 students propose an alternate CF1 curriculum with rationale — useful curriculum intelligence and forces the kind of precise thinking they're missing.
4. Smallest viable version of the practice environment: a set of well-designed interactive problems embedded in existing CF1 assignments, not a whole system. Build one, evaluate, then decide.
