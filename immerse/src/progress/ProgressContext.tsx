import { createContext, useCallback, useContext, useState, type ReactNode } from 'react'
import type { AttemptState } from '../components/Exercise'
import { getStorageValue, setStorageValue } from '../storage'

export function getSectionStatus(urlPath: string): AttemptState {
  const isRead = getStorageValue((d) => d.sections?.[urlPath]?.read ?? false)
  const ids = getStorageValue((d) => d.sections?.[urlPath]?.exercises ?? [])

  if (ids.length === 0) return isRead ? 'complete' : 'idle'

  const states = ids.map(
    (id) => (getStorageValue((d) => d.exercises?.[id]?.state) as AttemptState) ?? 'idle'
  )
  if (states.every((s) => s === 'complete')) return 'complete'
  if (states.some((s) => s === 'attempted' || s === 'complete')) return 'attempted'
  return 'idle'
}

type ProgressContextValue = {
  version: number
  registerExerciseInSection: (exerciseId: string, urlPath: string) => void
  notifyExerciseChange: () => void
}

const ProgressContext = createContext<ProgressContextValue | null>(null)

export const ProgressProvider = ({ children }: { children: ReactNode }) => {
  const [version, setVersion] = useState(0)

  const notifyExerciseChange = useCallback(() => {
    setVersion((v) => v + 1)
  }, [])

  const registerExerciseInSection = useCallback((exerciseId: string, urlPath: string) => {
    const ids = getStorageValue((d) => d.sections?.[urlPath]?.exercises ?? [])
    if (!ids.includes(exerciseId)) {
      setStorageValue((d) => {
        const section = ((d.sections ??= {})[urlPath] ??= {})
        ;(section.exercises ??= []).push(exerciseId)
      })
      setVersion((v) => v + 1)
    }
  }, [])

  return (
    <ProgressContext.Provider value={{ version, registerExerciseInSection, notifyExerciseChange }}>
      {children}
    </ProgressContext.Provider>
  )
}

export const useProgress = (): ProgressContextValue => {
  const ctx = useContext(ProgressContext)
  if (!ctx) throw new Error('useProgress must be used within ProgressProvider')
  return ctx
}
