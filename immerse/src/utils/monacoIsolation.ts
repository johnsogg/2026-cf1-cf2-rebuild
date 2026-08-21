import type { Monaco } from "@monaco-editor/react"

/**
 * Every Monaco `<Editor>` on a page shares one global TypeScript language
 * service. Since none of the exercise snippets have import/export
 * statements, TS treats each one as a "global script" rather than a module —
 * meaning top-level `const`/`let`/`function` declarations in one exercise's
 * editor collide with same-named declarations in any other exercise's editor
 * on the same page (e.g. two unrelated snippets both declaring `const size`).
 * `moduleDetection: "force"` makes TS treat every file as its own module
 * regardless of import/export, which isolates their scopes from each other.
 *
 * Call this in every Monaco editor's beforeMount handler. Idempotent.
 */
export function isolateMonacoTypescriptFiles(monaco: Monaco): void {
  const defaults = monaco.languages.typescript.typescriptDefaults
  defaults.setCompilerOptions({
    ...defaults.getCompilerOptions(),
    // Monaco's compiler-options API takes TS's internal enum value here, not
    // the "force" string tsconfig.json accepts — passing the string throws
    // at runtime ("moduleDetection is a string value..."). 3 is
    // ts.ModuleDetectionKind.Force; Monaco doesn't re-export that enum.
    moduleDetection: 3,
  })
}
