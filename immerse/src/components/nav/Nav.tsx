import { useNav } from '../../nav/NavContext'
import type { Chapter, Section, Unit } from '../../nav/navTree'
import { NavSection } from './NavSection'

export const NavBar = () => {
  const { currentSection, hasPrev, hasNext, goPrev, goNext } = useNav()

  return (
    <nav style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
      <button onClick={goPrev} disabled={!hasPrev}>
        ← Prev
      </button>
      <span>{currentSection.title}</span>
      <button onClick={goNext} disabled={!hasNext}>
        Next →
      </button>
    </nav>
  )
}

// export const TableOfContents2 = () => {
//   const { tree, currentSection } = useNav()

//   return (
//     <nav aria-label="Table of contents">
//       {tree.map((unit) => (
//         <section key={unit.slug}>
//           <strong>{unit.title}</strong>
//           {unit.chapters.map((chapter) => (
//             <section key={chapter.slug}>
//               <em>{chapter.title}</em>
//               <ul>
//                 {chapter.sections.map((section) => (
//                   <li key={section.path}>
//                     <Link
//                       to={section.urlPath}
//                       aria-current={
//                         section.path === currentSection.path
//                           ? 'page'
//                           : undefined
//                       }
//                     >
//                       {section.title}
//                     </Link>
//                   </li>
//                 ))}
//               </ul>
//             </section>
//           ))}
//         </section>
//       ))}
//     </nav>
//   )
// }

export const TableOfContents = () => {
  const { tree, currentSection } = useNav()

  return (
    <nav aria-label="Table of contents">
      {tree.map((unit) => (
        <NavUnit
          key={unit.slug}
          unit={unit}
          currentSection={currentSection}
        ></NavUnit>
      ))}
    </nav>
  )
}

const NavUnit = ({
  unit,
  currentSection,
}: {
  unit: Unit
  currentSection: Section
}) => {
  return (
    <>
      <div className="nav-unit">{unit.title}</div>
      <ul>
        {unit.chapters.map((chapter, idx) => (
          <NavChapter
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

const NavChapter = ({
  chapter,
  num,
  currentSection,
}: {
  chapter: Chapter
  num: number
  currentSection: Section
}) => {
  return (
    <div className="nav-chapter">
      <div className="nav-chapter__title">
        {num}. {chapter.title}
      </div>
      <ul>
        {chapter.sections.map((section, idx) => (
          <NavSection
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
