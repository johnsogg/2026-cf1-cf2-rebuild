import { createContext, useContext, useEffect, useMemo, type ComponentType, type ReactNode } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { buildNavTree, type Section, type Unit } from './navTree'

const titles = import.meta.glob<string>('./units/**/*.mdx', { import: 'title', eager: true })
const loaders = import.meta.glob<{ default: ComponentType }>('./units/**/*.mdx')

type NavContextValue = {
  tree: Unit[]
  currentSection: Section
  hasPrev: boolean
  hasNext: boolean
  goPrev: () => void
  goNext: () => void
  goTo: (urlPath: string) => void
}

const NavContext = createContext<NavContextValue | null>(null)

export function NavProvider({ children }: { children: ReactNode }) {
  const tree = useMemo(() => buildNavTree(titles, loaders), [])
  const flat = useMemo<Section[]>(() => tree.flatMap(u => u.chapters.flatMap(c => c.sections)), [tree])

  const location = useLocation()
  const navigate = useNavigate()

  useEffect(() => {
    if (location.pathname === '/') {
      navigate(flat[0].urlPath, { replace: true })
    }
  }, [])

  const currentSection = flat.find(s => s.urlPath === location.pathname) ?? flat[0]
  const currentIndex = flat.indexOf(currentSection)

  const value: NavContextValue = {
    tree,
    currentSection,
    hasPrev: currentIndex > 0,
    hasNext: currentIndex < flat.length - 1,
    goPrev: () => navigate(flat[currentIndex - 1].urlPath),
    goNext: () => navigate(flat[currentIndex + 1].urlPath),
    goTo: (urlPath) => navigate(urlPath),
  }

  return <NavContext.Provider value={value}>{children}</NavContext.Provider>
}

export function useNav(): NavContextValue {
  const ctx = useContext(NavContext)
  if (!ctx) throw new Error('useNav must be used within NavProvider')
  return ctx
}
