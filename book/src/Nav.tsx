import { Link } from 'react-router-dom'
import { useNav } from './NavContext'

export function NavBar() {
  const { currentSection, hasPrev, hasNext, goPrev, goNext } = useNav()

  return (
    <nav style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
      <button onClick={goPrev} disabled={!hasPrev}>← Prev</button>
      <span>{currentSection.title}</span>
      <button onClick={goNext} disabled={!hasNext}>Next →</button>
    </nav>
  )
}

export function TableOfContents() {
  const { tree, currentSection } = useNav()

  return (
    <nav aria-label="Table of contents">
      {tree.map(unit => (
        <section key={unit.slug}>
          <strong>{unit.title}</strong>
          {unit.chapters.map(chapter => (
            <section key={chapter.slug}>
              <em>{chapter.title}</em>
              <ul>
                {chapter.sections.map(section => (
                  <li key={section.path}>
                    <Link
                      to={section.urlPath}
                      aria-current={section.path === currentSection.path ? 'page' : undefined}
                    >
                      {section.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </section>
      ))}
    </nav>
  )
}
