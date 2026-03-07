import type { ComponentType } from 'react'

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

export const slugToTitle = (slug: string): string => {
  const withoutPrefix = slug.replace(/^\d+-/, '')
  const words = withoutPrefix.split('-')
  return words.map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')
}

const SECTION_RE = /\.\/units\/([\w-]+)\/chapters\/([\w-]+)\/sections\/([\w-]+)\.mdx$/

export const buildNavTree = (
  titles: Record<string, string>,
  loaders: Record<string, () => Promise<{ default: ComponentType }>>
): Unit[] => {
  const unitMap = new Map<string, Unit>()

  for (const path of Object.keys(titles)) {
    const match = SECTION_RE.exec(path)
    if (!match) continue

    const [, unitSlug, chapterSlug, sectionSlug] = match

    if (!unitMap.has(unitSlug)) {
      unitMap.set(unitSlug, { slug: unitSlug, title: slugToTitle(unitSlug), chapters: [] })
    }
    const unit = unitMap.get(unitSlug)!

    let chapter = unit.chapters.find(c => c.slug === chapterSlug)
    if (!chapter) {
      chapter = { slug: chapterSlug, title: slugToTitle(chapterSlug), sections: [] }
      unit.chapters.push(chapter)
    }

    chapter.sections.push({
      path,
      title: titles[path],
      urlPath: `/${unitSlug}/${chapterSlug}/${sectionSlug}`,
      load: loaders[path],
    })
  }

  const units = Array.from(unitMap.values())
  units.sort((a, b) => a.slug.localeCompare(b.slug))
  for (const unit of units) {
    unit.chapters.sort((a, b) => a.slug.localeCompare(b.slug))
    for (const chapter of unit.chapters) {
      chapter.sections.sort((a, b) => a.path.localeCompare(b.path))
    }
  }

  return units
}
