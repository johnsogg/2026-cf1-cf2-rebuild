import { assertNever } from "../utils/assertNever"
import s from "./Callout.module.css"

/**
 * Colored aside box, e.g. `<Callout intent="note">...</Callout>`. Import as
 * `import { Callout } from "immerse/components/Callout"`. `intent` picks the
 * color/icon; omit it (or pass "default") for an unstyled box.
 */
interface CalloutProps {
  children?: React.ReactNode
  intent: "danger" | "default" | "question" | "fun" | "note"
}

const getIntentStyle = (intent: CalloutProps["intent"]) => {
  switch (intent) {
    case "danger":
      return s.intentDanger
    case "default":
    case undefined:
      return ""
    case "question":
      return s.intentQuestion
    case "fun":
      return s.intentFun
    case "note":
      return s.intentNote
    default:
      assertNever(intent)
  }
}

const getIntentIcon = (intent: CalloutProps["intent"]) => {
  switch (intent) {
    case "danger":
      return "🤯"
    case "default":
      return undefined
    case "fun":
      return "😎"
    case "note":
      return "💡"
    case "question":
      return "🤔"
    case undefined:
      return ""
    default:
      assertNever(intent)
  }
}

export const Callout: React.FC<CalloutProps> = ({ intent, children }) => {
  const intentStyle = getIntentStyle(intent)
  return (
    <div
      className={[s.calloutContainer, intentStyle].filter(Boolean).join(" ")}
    >
      <span className={s.iconContainer}>{getIntentIcon(intent)}</span>
      <span>{children}</span>
    </div>
  )
}
