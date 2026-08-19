import type { ComponentType } from "react"
import { SECTION_PATH_RE } from "./sectionPath"

export { SECTION_PATH_RE } from "./sectionPath"

export type MiscPage = {
  title: string
  urlPath: string
  load: () => Promise<{ default: ComponentType }>
}

export type Section = {
  path: string
  title: string
  urlPath: string
  load: () => Promise<{ default: ComponentType }>
}

export type Chapter = {
  slug: string
  title: string
  sections: Section[]
}

export type Unit = {
  slug: string
  title: string
  chapters: Chapter[]
}

export type OrderMap = Record<string, string[]>

export const slugToTitle = (slug: string): string => {
  const withoutPrefix = slug.replace(/^\d+-/, "")
  const words = withoutPrefix.split("-")
  return words.map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ")
}

const SECTION_RE = new RegExp(`^\\.\\/${SECTION_PATH_RE.source}`)

function applyOrder<T extends { slug: string }>(
  items: T[],
  orderKey: string,
  order: OrderMap,
  level: "unit" | "chapter" | "section",
  context: string,
): T[] {
  const manifest = order[orderKey]
  if (!manifest) {
    throw new Error(
      `[navTree] Missing ${orderKey}/_order.json.\n` +
        `Found ${level}(s) on disk${context ? ` in ${context}` : ""}: ${
          items.map((i) => i.slug).join(", ") || "(none)"
        }.\n` +
        `Add an _order.json at that path listing these slugs in display order.`,
    )
  }

  const onDisk = new Set(items.map((i) => i.slug))
  const listed = new Set(manifest)
  const missingFromManifest = items
    .map((i) => i.slug)
    .filter((s) => !listed.has(s))
  const missingOnDisk = manifest.filter((s) => !onDisk.has(s))

  if (missingFromManifest.length || missingOnDisk.length) {
    const lines = [
      `[navTree] ${level} mismatch${context ? ` in ${context}` : ""} (${orderKey}/_order.json):`,
    ]
    if (missingFromManifest.length)
      lines.push(`  on disk but not listed: ${missingFromManifest.join(", ")}`)
    if (missingOnDisk.length)
      lines.push(`  listed but not found on disk: ${missingOnDisk.join(", ")}`)
    lines.push(`  Fix _order.json (or the folder/filename) so both sides match exactly.`)
    throw new Error(lines.join("\n"))
  }

  const index = new Map(manifest.map((slug, i) => [slug, i]))
  return [...items].sort((a, b) => index.get(a.slug)! - index.get(b.slug)!)
}

export const buildNavTree = (
  titles: Record<string, string>,
  loaders: Record<string, () => Promise<{ default: ComponentType }>>,
  order: OrderMap,
): Unit[] => {
  const unitMap = new Map<string, Unit>()

  for (const path of Object.keys(titles)) {
    const match = SECTION_RE.exec(path)
    if (!match) continue

    const [, unitSlug, chapterSlug, sectionSlug] = match

    if (!unitMap.has(unitSlug)) {
      unitMap.set(unitSlug, {
        slug: unitSlug,
        title: slugToTitle(unitSlug),
        chapters: [],
      })
    }
    const unit = unitMap.get(unitSlug)!

    let chapter = unit.chapters.find((c) => c.slug === chapterSlug)
    if (!chapter) {
      chapter = {
        slug: chapterSlug,
        title: slugToTitle(chapterSlug),
        sections: [],
      }
      unit.chapters.push(chapter)
    }

    chapter.sections.push({
      path,
      title: titles[path],
      urlPath: `/${unitSlug}/${chapterSlug}/${sectionSlug}`,
      load: loaders[path],
    })
  }

  const units = applyOrder(Array.from(unitMap.values()), "./units", order, "unit", "")

  for (const unit of units) {
    unit.chapters = applyOrder(
      unit.chapters,
      `./units/${unit.slug}/chapters`,
      order,
      "chapter",
      `unit "${unit.slug}"`,
    )
    for (const chapter of unit.chapters) {
      const withSlug = chapter.sections.map((section) => ({
        section,
        slug: section.urlPath.split("/").pop()!,
      }))
      const ordered = applyOrder(
        withSlug.map(({ slug }) => ({ slug })),
        `./units/${unit.slug}/chapters/${chapter.slug}/sections`,
        order,
        "section",
        `unit "${unit.slug}" > chapter "${chapter.slug}"`,
      )
      const bySlug = new Map(withSlug.map(({ slug, section }) => [slug, section]))
      chapter.sections = ordered.map(({ slug }) => bySlug.get(slug)!)
    }
  }

  return units
}
