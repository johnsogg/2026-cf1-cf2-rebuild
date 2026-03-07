import { Link } from 'react-router-dom'

import { useNav } from '../../nav/NavContext'
import type { Unit, Section, Chapter } from '../../nav/navTree'
import type { AttemptState } from '../Exercise'
import { AttemptedIcon, CompleteIcon, IdleIcon } from '../../img/StatusIcons'
import s from './TableOfContents.module.css'

export const TableOfContents = () => {
  const { tree, currentSection } = useNav()

  return (
    <nav aria-label="Table of contents">
      {tree.map((unit) => (
        <TocUnit
          key={unit.slug}
          unit={unit}
          currentSection={currentSection}
        ></TocUnit>
      ))}
    </nav>
  )
}

const TocUnit = ({
  unit,
  currentSection,
}: {
  unit: Unit
  currentSection: Section
}) => {
  return (
    <>
      <div className={s.unit}>{unit.title}</div>
      <ul>
        {unit.chapters.map((chapter, idx) => (
          <TocChapter
            key={chapter.slug}
            chapter={chapter}
            num={idx + 1}
            currentSection={currentSection}
          />
        ))}
      </ul>
    </>
  )
}

const TocChapter = ({
  chapter,
  num,
  currentSection,
}: {
  chapter: Chapter
  num: number
  currentSection: Section
}) => {
  return (
    <div className={s.chapter}>
      <div className={s.chapterTitle}>
        {num}. {chapter.title}
      </div>
      <ul>
        {chapter.sections.map((section, idx) => (
          <TocSection
            key={section.path}
            path={[num, idx + 1]}
            status="idle"
            section={section}
            isCurrentSection={currentSection === section}
          />
        ))}
      </ul>
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
  return (
    <li>
      <Link
        to={section.urlPath}
        aria-current={isCurrentSection ? 'page' : undefined}
      >
        <div
          className={`${s.section} ${isCurrentSection ? s.sectionSelected : ''}`}
        >
          <div>{getAttemptSymbol(status)}</div>
          <div>{path.join('.')}</div>
          <div className={s.sectionTitle}>{section.title}</div>
        </div>
      </Link>
    </li>
  )
}
