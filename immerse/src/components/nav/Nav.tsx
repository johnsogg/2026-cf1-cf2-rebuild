import { useNav } from '../../nav/NavContext'
import { SvgIcon } from '../SvgIcon'
import styles from './Nav.module.css'

export const NavBar = () => {
  const { hasPrev, hasNext, getPrevName, getNextName, goPrev, goNext } =
    useNav()

  return (
    <nav className={styles.nav}>
      <button
        className={`${!hasPrev ? styles.disabled : ''} ${styles.pageFlipper}`}
        onClick={goPrev}
        disabled={!hasPrev}
        aria-label="Previous section"
      >
        <SvgIcon name="prev" />
        <span className={styles.navCurrent}>
          {hasPrev ? `Previous: ${getPrevName()}` : 'BOF'}
        </span>
      </button>
      <button
        className={`${!hasNext ? styles.disabled : ''} ${styles.pageFlipper}`}
        onClick={goNext}
        disabled={!hasNext}
        aria-label="Next section"
      >
        <span className={styles.navCurrent}>
          {hasNext ? `Next: ${getNextName()}` : 'EOD'}
        </span>
        <SvgIcon name="next" />
      </button>
    </nav>
  )
}
