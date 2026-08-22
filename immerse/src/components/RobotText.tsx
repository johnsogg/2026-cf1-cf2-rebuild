import type { ReactNode } from "react"
import s from "./RobotText.module.css"

/**
 * Wraps AI-generated content in a distinct font (Doto, a dot-matrix
 * variable face) so readers can visually tell it apart from hand-written
 * prose. Globally available in book `.mdx` sections, no import needed.
 * Wrap the whole passage — prose, code fences, an `Ask`, whatever — in
 * one `<RobotText>...</RobotText>` block.
 */
export interface RobotTextProps {
  children?: ReactNode
}

export const RobotText: React.FC<RobotTextProps> = ({ children }) => {
  return <div className={s.robotText}>{children}</div>
}
