import { Link } from 'react-router-dom'

import type { Section } from '../../nav/navTree'
import type { AttemptState } from '../Exercise'
import { AttemptedIcon, CompleteIcon, IdleIcon } from '../../img/StatusIcons'

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
  const moreStyle = isCurrentSection ? 'nav-section--selected' : ''
  return (
    <li>
      <Link
        to={section.urlPath}
        aria-current={isCurrentSection ? 'page' : undefined}
      >
        <div className={`nav-section ${moreStyle}`}>
          <div>{getAttemptSymbol(status)}</div>
          <div>{path.join('.')}</div>
          <div className="nav-section__title">{section.title}</div>
        </div>
      </Link>
    </li>
  )
}

const x = `
<li key={section.path}>
            <Link
              to={section.urlPath}
              aria-current={
                section.path === currentSection.path ? 'page' : undefined
              }
            >
              {section.title}
            </Link>
          </li>
*/
`
