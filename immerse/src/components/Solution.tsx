import type { ReactNode } from "react"
import { AskContext, useAskRegistry, type AskContextValue } from "./Ask"
import s from "./Solution.module.css"

/**
 * Pairs with an `<Ask id="...">` by reusing its id — no separate id to
 * typo. Owns its own `<details>`/`<summary>` reveal, so authors don't
 * hand-wrap it — `exposeText` customizes the click-to-reveal label
 * (defaults to "Click here to show solution"). Renders a live warning
 * (always visible, not hidden behind the reveal) if no matching `Ask` was
 * found on this page. Any editable content inside persists under a
 * namespaced storage key (`${id}::solution`) so tinkering with a
 * solution's own widget never collides with the reader's attempt at the
 * original `Ask`. Globally available in book `.mdx` sections, no import
 * needed.
 */
export type SolutionProps = {
  id: string
  exposeText?: string
  children: ReactNode
}

export function Solution({
  id,
  exposeText = "Click here to show solution",
  children,
}: SolutionProps) {
  const { getNumber, hasId, getTitle } = useAskRegistry()
  const orphaned = !hasId(id)
  const ref = getTitle(id) ?? getNumber(id)

  const contextValue: AskContextValue = {
    id: `${id}::solution`,
    mode: "untracked",
    declareGradable: () => {},
    reportGrade: () => {},
  }

  return (
    <div className={s.solution}>
      {orphaned && (
        <div className={s.warningBanner} role="alert">
          ⚠ Solution id="{id}" has no matching Ask on this page.
        </div>
      )}
      <details className={s.details}>
        <summary className={s.summary}>
          {orphaned ? exposeText : `Solution to ${ref} — ${exposeText}`}
        </summary>
        <div className={s.content}>
          <AskContext.Provider value={contextValue}>
            {children}
          </AskContext.Provider>
        </div>
      </details>
    </div>
  )
}
