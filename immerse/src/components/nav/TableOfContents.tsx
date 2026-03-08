import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'

import { useNav } from '../../nav/NavContext'
import type { Unit, Section, Chapter } from '../../nav/navTree'
import type { AttemptState } from '../Exercise'
import { AttemptedIcon, CompleteIcon, IdleIcon } from '../../img/StatusIcons'
import { SvgIcon } from '../SvgIcon'
import s from './TableOfContents.module.css'
import { useProgress, getSectionStatus } from '../../progress/ProgressContext'
import { getStorageValue, setStorageValue } from '../../storage'

function findContaining(
  tree: Unit[],
  section: Section,
  level: 'unit' | 'chapter'
): Set<string> {
  for (const unit of tree) {
    for (const chapter of unit.chapters) {
      if (chapter.sections.includes(section)) {
        return new Set([level === 'unit' ? unit.slug : chapter.slug])
      }
    }
  }
  return new Set()
}

export const TableOfContents = () => {
  const { tree, currentSection } = useNav()
  useProgress() // subscribe to version changes for re-renders

  const [expandedUnits, setExpandedUnits] = useState<Set<string>>(() => {
    const stored = getStorageValue((d) => d.toc?.expandedUnits)
    return stored && stored.length > 0
      ? new Set(stored)
      : findContaining(tree, currentSection, 'unit')
  })
  const [expandedChapters, setExpandedChapters] = useState<Set<string>>(() => {
    const stored = getStorageValue((d) => d.toc?.expandedChapters)
    return stored && stored.length > 0
      ? new Set(stored)
      : findContaining(tree, currentSection, 'chapter')
  })

  useEffect(() => {
    for (const unit of tree) {
      for (const chapter of unit.chapters) {
        if (chapter.sections.includes(currentSection)) {
          setExpandedUnits((prev) => {
            const next = new Set([...prev, unit.slug])
            setStorageValue((d) => { (d.toc ??= {}).expandedUnits = [...next] })
            return next
          })
          setExpandedChapters((prev) => {
            const next = new Set([...prev, chapter.slug])
            setStorageValue((d) => { (d.toc ??= {}).expandedChapters = [...next] })
            return next
          })
          return
        }
      }
    }
  }, [currentSection])

  const toggleUnit = (slug: string) =>
    setExpandedUnits((prev) => {
      const next = new Set(prev)
      next.has(slug) ? next.delete(slug) : next.add(slug)
      setStorageValue((d) => { (d.toc ??= {}).expandedUnits = [...next] })
      return next
    })

  const toggleChapter = (slug: string) =>
    setExpandedChapters((prev) => {
      const next = new Set(prev)
      next.has(slug) ? next.delete(slug) : next.add(slug)
      setStorageValue((d) => { (d.toc ??= {}).expandedChapters = [...next] })
      return next
    })

  const revealAll = () => {
    const nextUnits = new Set(tree.map((u) => u.slug))
    const nextChapters = new Set(tree.flatMap((u) => u.chapters.map((c) => c.slug)))
    setExpandedUnits(nextUnits)
    setExpandedChapters(nextChapters)
    setStorageValue((d) => {
      (d.toc ??= {}).expandedUnits = [...nextUnits]
      d.toc.expandedChapters = [...nextChapters]
    })
  }

  const revealNone = () => {
    setExpandedUnits(new Set())
    setExpandedChapters(new Set())
    setStorageValue((d) => {
      (d.toc ??= {}).expandedUnits = []
      d.toc.expandedChapters = []
    })
  }

  const revealCurrent = () => {
    const nextUnits = findContaining(tree, currentSection, 'unit')
    const nextChapters = findContaining(tree, currentSection, 'chapter')
    setExpandedUnits(nextUnits)
    setExpandedChapters(nextChapters)
    setStorageValue((d) => {
      (d.toc ??= {}).expandedUnits = [...nextUnits]
      d.toc.expandedChapters = [...nextChapters]
    })
  }

  return (
    <nav aria-label="Table of contents" className={s.toc}>
      <div className={s.tocHeader}>
        <span className={s.tocTitle}>Table of Contents</span>
        <span className={s.revealControls}>
          <button className={s.revealBtn} onClick={revealAll}>all</button>
          {' / '}
          <button className={s.revealBtn} onClick={revealNone}>none</button>
          {' / '}
          <button className={s.revealBtn} onClick={revealCurrent}>current</button>
        </span>
      </div>
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
    </nav>
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
        <SvgIcon name={isExpanded ? 'chevronUp' : 'chevronDown'} size={18} />
      </div>
      <div className={`${s.collapsible} ${isExpanded ? s.collapsibleOpen : ''}`}>
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
  const collapsibleRef = useRef<HTMLDivElement>(null)

  const handleTransitionEnd = () => {
    if (isExpanded) {
      collapsibleRef.current
        ?.querySelector('[aria-current="page"]')
        ?.scrollIntoView({ block: 'nearest' })
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
        <span>{num}.</span>{' '}
        <span className={s.chapterTitleText}>{chapter.title}</span>
        <SvgIcon name={isExpanded ? 'chevronUp' : 'chevronDown'} size={16} />
      </div>
      <div
        ref={collapsibleRef}
        className={`${s.collapsible} ${isExpanded ? s.collapsibleOpen : ''}`}
        onTransitionEnd={handleTransitionEnd}
      >
        <ul>
          {chapter.sections.map((section, idx) => (
            <TocSection
              key={section.path}
              path={[num, idx + 1]}
              status={getSectionStatus(section.urlPath)}
              section={section}
              isCurrentSection={currentSection === section}
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
    case 'idle':
      return <IdleIcon />
    case 'attempted':
      return <AttemptedIcon />
    case 'complete':
      return <CompleteIcon />
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
      ref.current.scrollIntoView({ block: 'nearest' })
    }
  }, [isCurrentSection])

  return (
    <li
      ref={ref}
      className={`${s.section} ${isCurrentSection ? s.sectionSelected : ''}`}
    >
      <Link
        to={section.urlPath}
        aria-current={isCurrentSection ? 'page' : undefined}
      >
        <div className={`${s.sectionText}`}>
          <div>{getAttemptSymbol(status)}</div>
          <div>{path.join('.')}</div>
          <div className={s.sectionTitle}>{section.title}</div>
        </div>
      </Link>
    </li>
  )
}
