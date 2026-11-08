import type { ComponentType } from "react"
import { ImmerseApp } from "immerse/components/ImmerseApp"
import type { MiscPage } from "immerse/nav/navTree"
import type { TalkEntry } from "immerse/talks/TalksApp"
import { glossaryEntries } from "./glossary"
import { Callout } from "immerse/components/Callout"
import { P5Sketch } from "immerse/components/P5Sketch"
import Overview from "./overview.mdx"
import { totalExercises } from "virtual:exercise-totals"

const titles = import.meta.glob<string>("./units/**/*.mdx", {
  import: "title",
  eager: true,
})
const loaders = import.meta.glob<{ default: ComponentType }>("./units/**/*.mdx")
const orderModules = import.meta.glob<string[]>("./units/**/_order.json", {
  import: "default",
  eager: true,
})
const order = Object.fromEntries(
  Object.entries(orderModules).map(([path, arr]) => [
    path.replace(/\/_order\.json$/, ""),
    arr,
  ]),
)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const components: Record<string, ComponentType<any>> = { Callout, P5Sketch }

const miscTitles = import.meta.glob<string>("./misc/**/*.mdx", {
  import: "title",
  eager: true,
})
const miscLoaders = import.meta.glob<{ default: ComponentType }>("./misc/**/*.mdx")
const misc: MiscPage[] = Object.entries(miscTitles).map(([path, title]) => ({
  title,
  urlPath: "/misc/" + path.replace("./misc/", "").replace(/\.mdx$/, ""),
  load: miscLoaders[path],
}))

// Talks: talks/<slug>.mdx or talks/<slug>/index.mdx. Each exports `title` (shown
// in the talk) and optionally `tocTitle` (shorter, shown in the table of
// contents; falls back to `title`), `author`, `date` (ISO, original authoring)
// and optionally `lastRevised` (ISO, substantial content revisions only).
// A title slide shows them with <Byline />.
const talkMeta = import.meta.glob<{
  title: string
  tocTitle?: string
  author?: string
  date?: string
  lastRevised?: string
}>(
  "./talks/**/*.mdx",
  { eager: true },
)
const talkLoaders = import.meta.glob<{ default: ComponentType }>("./talks/**/*.mdx")
const talks: TalkEntry[] = Object.entries(talkMeta).map(([path, meta]) => ({
  slug: path.replace("./talks/", "").replace(/(\/index)?\.mdx$/, ""),
  title: meta.title,
  tocTitle: meta.tocTitle ?? meta.title,
  author: meta.author,
  date: meta.date,
  lastRevised: meta.lastRevised,
  load: talkLoaders[path],
}))

export default () => (
  <ImmerseApp
    bookSlug="cf1cf2"
    titles={titles}
    loaders={loaders}
    order={order}
    glossaryEntries={glossaryEntries}
    components={components}
    overview={Overview}
    totalExercises={totalExercises}
    misc={misc}
    talks={talks}
  />
)
