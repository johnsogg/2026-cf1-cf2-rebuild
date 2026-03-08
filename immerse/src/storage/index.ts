let slug: string | null = null

export function initStorage(bookSlug: string) {
  slug = bookSlug
}

function key() {
  if (!slug) throw new Error('initStorage() must be called before using storage')
  return `immerse-${slug}`
}

export type StorageData = {
  nav?: { lastSection?: string }
  toc?: { expandedUnits?: string[]; expandedChapters?: string[] }
  theme?: string
  sections?: Record<string, { read?: boolean; exercises?: string[] }>
  exercises?: Record<string, {
    state?: string
    // CodeExercise
    code?: string
    results?: { name: string; passed: boolean; error?: string }[]
    // MultipleChoiceExercise
    selected?: number
    submitted?: boolean
  }>
}

function read(): StorageData {
  try {
    return JSON.parse(localStorage.getItem(key()) ?? '{}')
  } catch {
    return {}
  }
}

function write(data: StorageData) {
  localStorage.setItem(key(), JSON.stringify(data))
}

export function getStorageValue<T>(getter: (d: StorageData) => T): T {
  return getter(read())
}

export function setStorageValue(updater: (d: StorageData) => void) {
  const d = read()
  updater(d)
  write(d)
}

export function removeStorageValue(updater: (d: StorageData) => void) {
  const d = read()
  updater(d)
  write(d)
}
