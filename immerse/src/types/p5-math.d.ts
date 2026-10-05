// p5 ships `p5/math` without type declarations. It's only used by the
// executor worker's headless p5 (see `workers/p5Headless.ts`).
declare module "p5/math" {
  const math: (p5: unknown) => void
  export default math
}
