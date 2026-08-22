import { useContext, useEffect, useRef, useState } from "react"
import { Link, useLocation } from "react-router-dom"

import { GlossaryContext } from "../Glossary"
import { useNav } from "../../nav/NavContext"
import type { Unit, Section, Chapter, MiscPage } from "../../nav/navTree"
import type { AskState as AttemptState } from "../Ask"
import { SvgIcon } from "../SvgIcon"
import s from "./TableOfContents.module.css"
import { useProgress, getSectionStatus } from "../../progress/ProgressContext"
import { getStorageValue, setStorageValue } from "../../storage"

function findContaining(
  tree: Unit[],
  section: Section,
  level: "unit" | "chapter",
): Set<string> {
  for (const unit of tree) {
    for (const chapter of unit.chapters) {
      if (chapter.sections.includes(section)) {
        return new Set([level === "unit" ? unit.slug : chapter.slug])
      }
    }
  }
  return new Set()
}

export const TableOfContents = () => {
  const { tree, misc, currentSection } = useNav()
  useProgress() // subscribe to version changes for re-renders
  const location = useLocation()

  const [tabletOpen, setTabletOpen] = useState(false)

  useEffect(() => {
    setTabletOpen(false)
  }, [location.pathname])

  const [expandedUnits, setExpandedUnits] = useState<Set<string>>(() => {
    const stored = getStorageValue((d) => d.toc?.expandedUnits)
    return stored && stored.length > 0
      ? new Set(stored)
      : findContaining(tree, currentSection, "unit")
  })
  const [expandedChapters, setExpandedChapters] = useState<Set<string>>(() => {
    const stored = getStorageValue((d) => d.toc?.expandedChapters)
    return stored && stored.length > 0
      ? new Set(stored)
      : findContaining(tree, currentSection, "chapter")
  })

  useEffect(() => {
    for (const unit of tree) {
      for (const chapter of unit.chapters) {
        if (chapter.sections.includes(currentSection)) {
          setExpandedUnits((prev) => {
            const next = new Set([...prev, unit.slug])
            setStorageValue((d) => {
              ;(d.toc ??= {}).expandedUnits = [...next]
            })
            return next
          })
          setExpandedChapters((prev) => {
            const next = new Set([...prev, chapter.slug])
            setStorageValue((d) => {
              ;(d.toc ??= {}).expandedChapters = [...next]
            })
            return next
          })
          return
        }
      }
    }
  }, [currentSection, tree])

  const toggleUnit = (slug: string) =>
    setExpandedUnits((prev) => {
      const next = new Set(prev)
      next.has(slug) ? next.delete(slug) : next.add(slug)
      setStorageValue((d) => {
        ;(d.toc ??= {}).expandedUnits = [...next]
      })
      return next
    })

  const toggleChapter = (slug: string) =>
    setExpandedChapters((prev) => {
      const next = new Set(prev)
      next.has(slug) ? next.delete(slug) : next.add(slug)
      setStorageValue((d) => {
        ;(d.toc ??= {}).expandedChapters = [...next]
      })
      return next
    })

  const revealAll = () => {
    const nextUnits = new Set(tree.map((u) => u.slug))
    const nextChapters = new Set(
      tree.flatMap((u) => u.chapters.map((c) => c.slug)),
    )
    setExpandedUnits(nextUnits)
    setExpandedChapters(nextChapters)
    setStorageValue((d) => {
      ;(d.toc ??= {}).expandedUnits = [...nextUnits]
      d.toc.expandedChapters = [...nextChapters]
    })
  }

  const revealNone = () => {
    setExpandedUnits(new Set())
    setExpandedChapters(new Set())
    setStorageValue((d) => {
      ;(d.toc ??= {}).expandedUnits = []
      d.toc.expandedChapters = []
    })
  }

  const revealCurrent = () => {
    const nextUnits = findContaining(tree, currentSection, "unit")
    const nextChapters = findContaining(tree, currentSection, "chapter")
    setExpandedUnits(nextUnits)
    setExpandedChapters(nextChapters)
    setStorageValue((d) => {
      ;(d.toc ??= {}).expandedUnits = [...nextUnits]
      d.toc.expandedChapters = [...nextChapters]
    })
  }

  return (
    <div className={s.tocWrapper}>
      <button className={s.tabletTrigger} onClick={() => setTabletOpen(true)}>
        <SvgIcon name="book" size={20} />
        <span>Table of Contents</span>
      </button>
      {tabletOpen && <div className={s.backdrop} onClick={() => setTabletOpen(false)} />}
      <nav aria-label="Table of contents" className={`${s.toc} ${tabletOpen ? s.tocTabletOpen : ""}`}>
      <div className={s.tocHeader}>
        <span className={s.tocTitle}>Table of Contents</span>
        <span className={s.revealControls}>
          <button className={s.revealBtn} onClick={revealAll}>
            all
          </button>
          {" / "}
          <button className={s.revealBtn} onClick={revealNone}>
            none
          </button>
          {" / "}
          <button className={s.revealBtn} onClick={revealCurrent}>
            current
          </button>
        </span>
      </div>
      <TocHome />
      {tree.map((unit) => (
        <TocUnit
          key={unit.slug}
          unit={unit}
          currentSection={currentSection}
          isExpanded={expandedUnits.has(unit.slug)}
          onToggle={() => toggleUnit(unit.slug)}
          expandedChapters={expandedChapters}
          onToggleChapter={toggleChapter}
        />
      ))}
      <TocGlossary />
      {misc.map((page) => (
        <TocMiscPage key={page.urlPath} page={page} />
      ))}
      </nav>
    </div>
  )
}

const TocHome = () => {
  const location = useLocation()
  const isActive = location.pathname === "/"

  return (
    <Link
      to="/"
      className={`${s.unit} ${s.unitLink} ${isActive ? s.unitLinkActive : ""}`}
    >
      Home
    </Link>
  )
}

const TocGlossary = () => {
  const ctx = useContext(GlossaryContext)
  const location = useLocation()

  if (!ctx || ctx.sortedEntries.length === 0) return null

  const isActive = location.pathname === "/glossary"

  return (
    <Link
      to="/glossary"
      className={`${s.unit} ${s.unitLink} ${isActive ? s.unitLinkActive : ""}`}
    >
      Glossary
    </Link>
  )
}

const TocMiscPage = ({ page }: { page: MiscPage }) => {
  const location = useLocation()
  const isActive = location.pathname === page.urlPath
  return (
    <Link
      to={page.urlPath}
      className={`${s.unit} ${s.unitLink} ${isActive ? s.unitLinkActive : ""}`}
    >
      {page.title}
    </Link>
  )
}

const TocUnit = ({
  unit,
  currentSection,
  isExpanded,
  onToggle,
  expandedChapters,
  onToggleChapter,
}: {
  unit: Unit
  currentSection: Section
  isExpanded: boolean
  onToggle: () => void
  expandedChapters: Set<string>
  onToggleChapter: (slug: string) => void
}) => {
  return (
    <>
      <div
        className={s.unit}
        onClick={onToggle}
        role="button"
        aria-expanded={isExpanded}
      >
        <span>{unit.title}</span>
        <SvgIcon name={isExpanded ? "chevronUp" : "chevronDown"} size={18} />
      </div>
      <div
        className={`${s.collapsible} ${isExpanded ? s.collapsibleOpen : ""}`}
      >
        <ul>
          {unit.chapters.map((chapter, idx) => (
            <TocChapter
              key={chapter.slug}
              chapter={chapter}
              num={idx + 1}
              currentSection={currentSection}
              isExpanded={expandedChapters.has(chapter.slug)}
              onToggle={() => onToggleChapter(chapter.slug)}
            />
          ))}
        </ul>
      </div>
    </>
  )
}

const TocChapter = ({
  chapter,
  num,
  currentSection,
  isExpanded,
  onToggle,
}: {
  chapter: Chapter
  num: number
  currentSection: Section
  isExpanded: boolean
  onToggle: () => void
}) => {
  const location = useLocation()
  const collapsibleRef = useRef<HTMLDivElement>(null)

  const handleTransitionEnd = () => {
    if (isExpanded) {
      collapsibleRef.current
        ?.querySelector('[aria-current="page"]')
        ?.scrollIntoView({ block: "nearest" })
    }
  }

  return (
    <div className={s.chapter}>
      <div
        className={s.chapterTitle}
        onClick={onToggle}
        role="button"
        aria-expanded={isExpanded}
      >
        <span>{num}.</span>{" "}
        <span className={s.chapterTitleText}>{chapter.title}</span>
        <SvgIcon name={isExpanded ? "chevronUp" : "chevronDown"} size={16} />
      </div>
      <div
        ref={collapsibleRef}
        className={`${s.collapsible} ${isExpanded ? s.collapsibleOpen : ""}`}
        onTransitionEnd={handleTransitionEnd}
      >
        <ul>
          {chapter.sections.map((section, idx) => (
            <TocSection
              key={section.path}
              path={[num, idx + 1]}
              status={getSectionStatus(section.urlPath)}
              section={section}
              isCurrentSection={
                currentSection === section && location.pathname !== "/"
              }
            />
          ))}
        </ul>
      </div>
    </div>
  )
}

interface TocSectionProps {
  path: number[] // e.g. [1, 3] for chapter 1, section 3
  section: Section
  status: AttemptState
  isCurrentSection: boolean
}

const getAttemptSymbol = (status: AttemptState) => {
  switch (status) {
    case "idle":
      return <SvgIcon name="statusIdle" size={10} intent="muted" />
    case "attempted":
      return <SvgIcon name="statusAttempted" size={10} intent="danger" />
    case "complete":
      return <SvgIcon name="statusComplete" size={10} intent="success" />
  }
}

export const TocSection = ({
  path,
  section,
  status,
  isCurrentSection,
}: TocSectionProps) => {
  const ref = useRef<HTMLLIElement>(null)

  useEffect(() => {
    if (isCurrentSection && ref.current && ref.current.offsetHeight > 0) {
      ref.current.scrollIntoView({ block: "nearest" })
    }
  }, [isCurrentSection])

  return (
    <li
      ref={ref}
      className={`${s.section} ${isCurrentSection ? s.sectionSelected : ""}`}
    >
      <Link
        to={section.urlPath}
        aria-current={isCurrentSection ? "page" : undefined}
      >
        <div className={`${s.sectionText}`}>
          <div>{getAttemptSymbol(status)}</div>
          <div>{path.join(".")}</div>
          <div className={s.sectionTitle}>{section.title}</div>
        </div>
      </Link>
    </li>
  )
}
