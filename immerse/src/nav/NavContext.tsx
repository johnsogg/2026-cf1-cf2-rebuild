import {
  createContext,
  useContext,
  useMemo,
  useRef,
  type ComponentType,
  type ReactNode,
} from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { buildNavTree, type MiscPage, type Section, type Unit } from "./navTree"

type NavContextValue = {
  tree: Unit[]
  misc: MiscPage[]
  currentSection: Section
  hasPrev: boolean
  hasNext: boolean
  getPrevName: () => string
  getNextName: () => string
  goPrev: () => void
  goNext: () => void
  goTo: (urlPath: string) => void
}

const NavContext = createContext<NavContextValue | null>(null)

type NavProviderProps = {
  titles: Record<string, string>
  loaders: Record<string, () => Promise<{ default: ComponentType }>>
  misc: MiscPage[]
  children: ReactNode
}

export const NavProvider = ({
  titles,
  loaders,
  misc,
  children,
}: NavProviderProps) => {
  const tree = useMemo(() => buildNavTree(titles, loaders), [loaders, titles])
  const flat = useMemo<Section[]>(
    () => tree.flatMap((u) => u.chapters.flatMap((c) => c.sections)),
    [tree],
  )

  const location = useLocation()
  const navigate = useNavigate()

  const matchedSection = flat.find((s) => s.urlPath === location.pathname)
  const lastRealSectionRef = useRef<Section>(matchedSection ?? flat[0])
  if (matchedSection) lastRealSectionRef.current = matchedSection
  const currentSection = lastRealSectionRef.current
  const currentIndex = flat.indexOf(currentSection)

  const value: NavContextValue = {
    tree,
    misc,
    currentSection,
    hasPrev: currentIndex > 0,
    hasNext: currentIndex < flat.length - 1,
    getPrevName: () => (currentIndex > 0 ? flat[currentIndex - 1].title : ""),
    getNextName: () =>
      currentIndex < flat.length - 1 ? flat[currentIndex + 1].title : "",
    goPrev: () => navigate(flat[currentIndex - 1].urlPath),
    goNext: () => navigate(flat[currentIndex + 1].urlPath),
    goTo: (urlPath) => navigate(urlPath),
  }

  return <NavContext.Provider value={value}>{children}</NavContext.Provider>
}

export const useNav = (): NavContextValue => {
  const ctx = useContext(NavContext)
  if (!ctx) throw new Error("useNav must be used within NavProvider")
  return ctx
}
