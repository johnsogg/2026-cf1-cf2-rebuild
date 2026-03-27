import { assertNever } from "../utils/assertNever"
import s from "./Callout.module.css"

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
