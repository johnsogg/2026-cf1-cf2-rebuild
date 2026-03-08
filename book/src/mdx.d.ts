declare module "*.mdx" {
  import type { ComponentType } from "react"
  export const title: string
  const MDXComponent: ComponentType
  export default MDXComponent
}

declare module "*?raw" {
  const content: string
  export default content
}

declare module "virtual:exercise-totals" {
  export const totalExercises: number
  export const exercisesPerSection: Record<string, number>
}
