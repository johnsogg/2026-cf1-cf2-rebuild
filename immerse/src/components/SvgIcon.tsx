export type SvgName = 'gear' | 'next' | 'prev' | 'heart' | 'book'
export type Intent = 'default' | 'danger' | 'error' | 'success' | 'info'

export type SvgIconProps = {
  name: SvgName
  size?: number
  intent?: Intent
}

const paths: Record<SvgName, string> = {
  gear: 'M12 15.5A3.5 3.5 0 0 1 8.5 12 3.5 3.5 0 0 1 12 8.5a3.5 3.5 0 0 1 3.5 3.5 3.5 3.5 0 0 1-3.5 3.5m7.43-2.92c.04-.34.07-.69.07-1.08s-.03-.73-.07-1.08l2.32-1.82c.21-.16.27-.46.13-.7l-2.2-3.81c-.13-.24-.42-.32-.66-.24l-2.74 1.1c-.57-.44-1.18-.81-1.86-1.08L14.88 2.1A.54.54 0 0 0 14.34 2H9.66c-.27 0-.5.19-.54.44L8.74 5.08C8.06 5.35 7.45 5.72 6.88 6.16L4.14 5.06c-.24-.09-.53 0-.66.24L1.28 9.11c-.14.24-.08.54.13.7l2.32 1.82C3.69 11.97 3.66 12.32 3.66 12.5s.03.74.07 1.08L1.41 15.4c-.21.16-.27.46-.13.7l2.2 3.81c.13.24.42.32.66.24l2.74-1.1c.57.44 1.18.81 1.86 1.08l.38 2.97c.04.26.27.44.54.44h4.68c.27 0 .5-.18.54-.44l.38-2.97c.68-.27 1.29-.64 1.86-1.08l2.74 1.1c.24.09.53 0 .66-.24l2.2-3.81c.14-.24.08-.54-.13-.7l-2.32-1.82z',
  next: 'M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z',
  prev: 'M15.41 16.59L10.83 12l4.58-4.59L14 6l-6 6 6 6 1.41-1.41z',
  heart: 'M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z',
  book: 'M18 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM6 4h5v8l-2.5-1.5L6 12V4z',
}

const intentColors: Record<Intent, string> = {
  default: 'currentColor',
  danger:  'var(--warning)',
  error:   'var(--error)',
  success: 'var(--success)',
  info:    'var(--accent)',
}

export function SvgIcon({ name, size = 24, intent = 'default' }: SvgIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={intentColors[intent]}
      aria-hidden="true"
    >
      <path d={paths[name]} />
    </svg>
  )
}
