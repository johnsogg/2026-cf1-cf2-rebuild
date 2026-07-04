import styles from './ExpectedReadTime.module.css'

const WPM = 200

/**
 * "N min" read-time badge. Globally available in book `.mdx` sections, no
 * import needed, but must be written literally as
 * `<ExpectedReadTime wordCount={wordCount} />` — the `remarkWordCount` plugin
 * scans each section for that exact call and injects the `wordCount`
 * variable at build time.
 */
export function ExpectedReadTime({ wordCount }: { wordCount: number }) {
  const minutes = Math.ceil(wordCount / WPM)
  return (
    <div className={styles.readTime}>
      {minutes} min
    </div>
  )
}
