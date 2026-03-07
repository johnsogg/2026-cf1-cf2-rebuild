import { useNav } from '../../nav/NavContext'

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
