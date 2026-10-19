// Copies of ~/courses/space-junk/phase-builds/phase-N (the JS files only). See
// the Space Junk Game homework's phase-builds.ts for how these are used: each
// build is a set of global <script> files, so concatenating them gives a single
// sketch that <P5Sketch> can run.

const join = (files: Record<string, string>) => Object.values(files).join("\n\n")

export const phase4 = join(
  import.meta.glob<string>("./phase-4/*.js", { query: "?raw", import: "default", eager: true }),
)
export const phase5 = join(
  import.meta.glob<string>("./phase-5/*.js", { query: "?raw", import: "default", eager: true }),
)
