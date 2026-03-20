import styles from './ExpectedReadTime.module.css'

const WPM = 200

export function ExpectedReadTime({ wordCount }: { wordCount: number }) {
  const minutes = Math.ceil(wordCount / WPM)
  return (
    <div className={styles.readTime}>
      {minutes} min
    </div>
  )
}
