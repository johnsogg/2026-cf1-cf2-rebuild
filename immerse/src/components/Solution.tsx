import type { ReactNode } from "react"
import { AskContext, useAskRegistry, type AskContextValue } from "./Ask"
import s from "./Solution.module.css"

/**
 * Pairs with an `<Ask id="...">` by reusing its id — no separate id to
 * typo. Renders a live warning if no matching `Ask` was found on this
 * page. Any editable content inside persists under a namespaced storage
 * key (`${id}::solution`) so tinkering with a solution's own widget never
 * collides with the reader's attempt at the original `Ask`. Globally
 * available in book `.mdx` sections, no import needed.
 */
export type SolutionProps = {
  id: string
  children: ReactNode
}

export function Solution({ id, children }: SolutionProps) {
  const { getNumber, hasId } = useAskRegistry()
  const orphaned = !hasId(id)

  const contextValue: AskContextValue = {
    id: `${id}::solution`,
    mode: "untracked",
    declareGradable: () => {},
    reportGrade: () => {},
  }

  return (
    <div className={s.solution}>
      {orphaned ? (
        <div className={s.warningBanner} role="alert">
          ⚠ Solution id="{id}" has no matching Ask on this page.
        </div>
      ) : (
        <div className={s.solutionLabel}>Solution to {getNumber(id)}</div>
      )}
      <AskContext.Provider value={contextValue}>
        {children}
      </AskContext.Provider>
    </div>
  )
}
