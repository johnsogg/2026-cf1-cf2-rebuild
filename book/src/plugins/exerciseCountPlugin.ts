import type { Plugin } from "vite"
import { readFileSync, readdirSync } from "node:fs"
import { join } from "node:path"
import { fileURLToPath } from "node:url"

const VIRTUAL_ID = "virtual:exercise-totals"
const RESOLVED_ID = "\0" + VIRTUAL_ID

const SECTION_RE =
  /units\/([\w-]+)\/chapters\/([\w-]+)\/sections\/([\w-]+)\.mdx$/
const EXERCISE_RE = /<Exercise\b/g

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

      for (const file of files) {
        const match = SECTION_RE.exec(file)
        if (!match) continue
        const [, unitSlug, chapterSlug, sectionSlug] = match
        const source = readFileSync(file, "utf-8")
        const count = (source.match(EXERCISE_RE) ?? []).length
        if (count > 0) {
          const urlPath = `/${unitSlug}/${chapterSlug}/${sectionSlug}`
          exercisesPerSection[urlPath] = count
          totalExercises += count
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
