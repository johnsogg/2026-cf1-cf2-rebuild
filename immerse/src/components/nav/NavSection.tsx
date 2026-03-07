import { Link } from 'react-router-dom'

import type { Section } from '../../nav/navTree'
import type { AttemptState } from '../Exercise'
import { AttemptedIcon, CompleteIcon, IdleIcon } from '../../img/StatusIcons'
import s from './NavSection.module.css'

interface NavSectionProps {
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

export const NavSection = ({
  path,
  section,
  status,
  isCurrentSection,
}: NavSectionProps) => {
  return (
    <li>
      <Link
        to={section.urlPath}
        aria-current={isCurrentSection ? 'page' : undefined}
      >
        <div className={`${s.section} ${isCurrentSection ? s.sectionSelected : ''}`}>
          <div>{getAttemptSymbol(status)}</div>
          <div>{path.join('.')}</div>
          <div className={s.sectionTitle}>{section.title}</div>
        </div>
      </Link>
    </li>
  )
}

