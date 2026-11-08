import { useEffect, useState, type ComponentType } from "react"
import { Link, useLocation } from "react-router-dom"
import { MDXProvider } from "@mdx-js/react"
import { Talk } from "./Talk"
import { Slide, Notes, Reveal, Columns } from "./Slide"
import { YouAreHere } from "./YouAreHere"
import { DoubleDiamond } from "./DoubleDiamond"
import { JobPath } from "./JobPath"
import { WickedCriteria } from "./WickedCriteria"
import { WorldsDiagram } from "./WorldsDiagram"
import s from "./talks.module.css"

export type TalkEntry = {
  slug: string
  title: string
  tocTitle: string
  load: () => Promise<{ default: ComponentType }>
}

// Available in a talk's .mdx with no import.
const talkComponents = {
  Slide,
  Notes,
  Reveal,
  Columns,
  YouAreHere,
  WorldsDiagram,
  WickedCriteria,
  DoubleDiamond,
  JobPath,
}

const TalkLoader = ({
  entry,
  view,
}: {
  entry: TalkEntry
  view: "notes" | "slides" | "print"
}) => {
  const [Content, setContent] = useState<ComponentType | null>(null)
  useEffect(() => {
    setContent(null)
    entry.load().then((mod) => setContent(() => mod.default))
  }, [entry])
  if (!Content) return <p className={s.loading}>Loading…</p>
  return (
    <Talk
      slug={entry.slug}
      title={entry.title}
      Content={Content}
      mode={view === "slides" ? "present" : view}
    />
  )
}

export const TalksApp = ({ talks }: { talks: TalkEntry[] }) => {
  const { pathname, search } = useLocation()
  const [slug, view] = pathname
    .replace(/^\/talks\/?/, "")
    .split("/")
    .filter(Boolean)

  const entry = talks.find((t) => t.slug === slug)

  if (!slug) {
    return (
      <div className={s.index}>
        <h1>Talks</h1>
        <ul>
          {talks.map((t) => (
            <li key={t.slug}>
              <Link to={`/talks/${t.slug}`}>{t.title}</Link>
            </li>
          ))}
        </ul>
      </div>
    )
  }

  if (!entry) {
    return (
      <div className={s.index}>
        <h1>No such talk</h1>
        <Link to="/talks">All talks</Link>
      </div>
    )
  }

  const kind =
    view === "slides"
      ? search.includes("print")
        ? "print"
        : "slides"
      : "notes"

  return (
    <MDXProvider components={talkComponents}>
      {/* key: switching views remounts so slide positions are recomputed */}
      <TalkLoader key={`${entry.slug}-${kind}`} entry={entry} view={kind} />
    </MDXProvider>
  )
}
