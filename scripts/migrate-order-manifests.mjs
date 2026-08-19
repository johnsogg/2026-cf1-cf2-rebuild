import { readdirSync, writeFileSync } from "node:fs"
import { join } from "node:path"
import { execFileSync } from "node:child_process"

const UNITS_DIR = "book/src/units"
const strip = (name) => name.replace(/^\d+-/, "")
const gitMv = (from, to) => execFileSync("git", ["mv", from, to])

function orderedNumberedDirs(dir) {
  return readdirSync(dir, { withFileTypes: true })
    .filter((e) => e.isDirectory() && /^\d+-/.test(e.name))
    .map((e) => e.name)
    .sort()
}

function orderedSectionFiles(dir) {
  return readdirSync(dir, { withFileTypes: true })
    .filter((e) => e.isFile() && /^\d+-.*\.mdx$/.test(e.name))
    .map((e) => e.name)
    .sort()
}

function writeOrder(dir, slugs) {
  writeFileSync(join(dir, "_order.json"), JSON.stringify(slugs, null, 2) + "\n")
}

// 1. units
const unitDirs = orderedNumberedDirs(UNITS_DIR)
const unitSlugs = unitDirs.map(strip)
for (const name of unitDirs) gitMv(join(UNITS_DIR, name), join(UNITS_DIR, strip(name)))
writeOrder(UNITS_DIR, unitSlugs)

// 2. chapters per unit, 3. sections per chapter
for (const unitSlug of unitSlugs) {
  const chaptersDir = join(UNITS_DIR, unitSlug, "chapters")
  const chapterDirs = orderedNumberedDirs(chaptersDir)
  const chapterSlugs = chapterDirs.map(strip)
  for (const name of chapterDirs)
    gitMv(join(chaptersDir, name), join(chaptersDir, strip(name)))
  writeOrder(chaptersDir, chapterSlugs)

  for (const chapterSlug of chapterSlugs) {
    const sectionsDir = join(chaptersDir, chapterSlug, "sections")
    const sectionFiles = orderedSectionFiles(sectionsDir)
    const sectionSlugs = sectionFiles.map((n) => strip(n).replace(/\.mdx$/, ""))
    for (const name of sectionFiles)
      gitMv(join(sectionsDir, name), join(sectionsDir, strip(name)))
    writeOrder(sectionsDir, sectionSlugs)
  }
}

console.log("Migration complete.")
