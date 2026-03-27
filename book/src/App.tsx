import type { ComponentType } from "react"
import { ImmerseApp } from "immerse/components/ImmerseApp"
import type { MiscPage } from "immerse/nav/navTree"
import { glossaryEntries } from "./glossary"
import { Callout } from "./components/Callout" // book-specific content component
import { P5Sketch } from "immerse/components/P5Sketch"
import Overview from "./overview.mdx"
import { totalExercises } from "virtual:exercise-totals"

const titles = import.meta.glob<string>("./units/**/*.mdx", {
  import: "title",
  eager: true,
})
const loaders = import.meta.glob<{ default: ComponentType }>("./units/**/*.mdx")
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

export default () => (
  <ImmerseApp
    bookSlug="cf1cf2"
    titles={titles}
    loaders={loaders}
    glossaryEntries={glossaryEntries}
    components={components}
    overview={Overview}
    totalExercises={totalExercises}
    misc={misc}
  />
)
