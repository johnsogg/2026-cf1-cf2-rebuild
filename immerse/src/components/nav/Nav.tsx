import { IconButton } from '../IconButton'
import { useNav } from '../../nav/NavContext'
import { SvgIcon } from '../SvgIcon'
import styles from './Nav.module.css'

export const NavBar = () => {
  const { hasPrev, hasNext, getPrevName, getNextName, goPrev, goNext } =
    useNav()

  const goPrevSafe = () => hasPrev && goPrev()
  const goNextSafe = () => hasNext && goNext()

  return (
    <nav style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
      <div
        className={`${!hasPrev && styles.disabled} ${styles.pageFlipper}`}
        onClick={goPrevSafe}
      >
        <IconButton
          onClick={goPrev}
          disabled={!hasPrev}
          aria-label="Previous section"
        >
          <SvgIcon name="prev" />
        </IconButton>
        <span className={styles.navCurrent}>
          {hasPrev && `Previous: ${getPrevName()}`}
          {!hasPrev && `BOF`}
        </span>
      </div>
      <div
        className={`${!hasNext && styles.disabled} ${styles.pageFlipper}`}
        onClick={goNextSafe}
      >
        <span className={styles.navCurrent}>
          {hasNext && `Next: ${getNextName()}`}
          {!hasNext && `EOD`}
        </span>
        <IconButton
          onClick={goNext}
          disabled={!hasNext}
          aria-label="Next section"
        >
          <SvgIcon name="next" />
        </IconButton>
      </div>
    </nav>
  )
}
