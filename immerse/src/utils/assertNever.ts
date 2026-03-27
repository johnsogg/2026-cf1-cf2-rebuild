export const assertNever = (x: never) => {
  throw new Error(`Unhandled value: ${x}`)
}
