import type { ComponentType } from 'react'
import { ImmersApp } from 'immerse/components/ImmerseApp'
import { glossaryEntries } from './glossary'
import { Callout } from './components/Callout' // book-specific content component

const titles = import.meta.glob<string>('./units/**/*.mdx', {
  import: 'title',
  eager: true,
})
const loaders = import.meta.glob<{ default: ComponentType }>('./units/**/*.mdx')
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const components: Record<string, ComponentType<any>> = { Callout }

export default () => (
  <ImmersApp
    titles={titles}
    loaders={loaders}
    glossaryEntries={glossaryEntries}
    components={components}
  />
)
