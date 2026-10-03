// Copies of ~/courses/space-junk/phase-builds/phase-N (the JS files only),
// regenerated there by scripts/make-phase-builds.js. Each build is a set of
// global <script> files with no imports, and load order doesn't matter, so
// concatenating them gives a single sketch that <P5Sketch> can run.

const join = (files: Record<string, string>) => Object.values(files).join("\n\n")

export const phase1 = join(
  import.meta.glob<string>("./phase-1/*.js", { query: "?raw", import: "default", eager: true }),
)
export const phase2 = join(
  import.meta.glob<string>("./phase-2/*.js", { query: "?raw", import: "default", eager: true }),
)
export const phase3 = join(
  import.meta.glob<string>("./phase-3/*.js", { query: "?raw", import: "default", eager: true }),
)
