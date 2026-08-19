import type { Plugin } from "vite"
import { readFileSync, readdirSync } from "node:fs"
import { join } from "node:path"
import { fileURLToPath } from "node:url"
import { SECTION_PATH_RE } from "../../../immerse/src/nav/sectionPath"

const VIRTUAL_ID = "virtual:exercise-totals"
const RESOLVED_ID = "\0" + VIRTUAL_ID

const SECTION_RE = SECTION_PATH_RE
// Matches a whole <Ask ...> opening tag so the mode= attribute can be
// inspected — untracked asks don't count toward the completion total.
const ASK_TAG_RE = /<Ask\b[^>]*>/g
const UNTRACKED_RE = /\bmode=["']untracked["']/
// Only catches a literal id="..." — an id={someExpression} (e.g. a CodeExercise
// pulling its id from an imported exercise object) can't be resolved statically,
// so those are skipped rather than risk false positives.
const LITERAL_ID_RE = /\bid=["']([^"']+)["']/

function getMdxFiles(dir: string): string[] {
  const files: string[] = []
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name)
    if (entry.isDirectory()) {
      files.push(...getMdxFiles(full))
    } else if (entry.name.endsWith(".mdx")) {
      files.push(full)
    }
  }
  return files
}

export function exerciseCountPlugin(): Plugin {
  const unitsDir = fileURLToPath(new URL("../units", import.meta.url))

  return {
    name: "exercise-count",
    resolveId(id) {
      if (id === VIRTUAL_ID) return RESOLVED_ID
    },
    load(id) {
      if (id !== RESOLVED_ID) return

      const files = getMdxFiles(unitsDir)
      let totalExercises = 0
      const exercisesPerSection: Record<string, number> = {}
      const idLocations = new Map<string, string[]>()

      for (const file of files) {
        const match = SECTION_RE.exec(file)
        if (!match) continue
        const [, unitSlug, chapterSlug, sectionSlug] = match
        const source = readFileSync(file, "utf-8")
        const askTags = source.match(ASK_TAG_RE) ?? []
        const count = askTags.filter((tag) => !UNTRACKED_RE.test(tag)).length
        if (count > 0) {
          const urlPath = `/${unitSlug}/${chapterSlug}/${sectionSlug}`
          exercisesPerSection[urlPath] = count
          totalExercises += count
        }

        for (const tag of askTags) {
          const idMatch = LITERAL_ID_RE.exec(tag)
          if (!idMatch) continue
          const id = idMatch[1]
          const locations = idLocations.get(id) ?? []
          locations.push(`${unitSlug}/${chapterSlug}/${sectionSlug}`)
          idLocations.set(id, locations)
        }
      }

      for (const [id, locations] of idLocations) {
        if (locations.length > 1) {
          console.warn(
            `[exercise-count] duplicate Ask id="${id}" found in: ${locations.join(", ")}`,
          )
        }
      }

      return [
        `export const totalExercises = ${totalExercises}`,
        `export const exercisesPerSection = ${JSON.stringify(exercisesPerSection)}`,
      ].join("\n")
    },
    handleHotUpdate({ file, server }) {
      if (file.endsWith(".mdx")) {
        const mod = server.moduleGraph.getModuleById(RESOLVED_ID)
        if (mod) server.moduleGraph.invalidateModule(mod)
      }
    },
  }
}
