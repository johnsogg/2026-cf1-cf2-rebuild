import type { Plugin, ResolvedConfig } from "vite"
import { readFileSync, existsSync } from "node:fs"
import { resolve, dirname } from "node:path"

const SUFFIX = "?bundle"

// Matches: import ... from "./path" (handles multi-line)
const IMPORT_FROM_RE = /\bimport\b[\s\S]*?from\s*['"]([^'"]+)['"]\s*;?/g
// Matches: import "./side-effect"
const IMPORT_SIDE_EFFECT_RE = /\bimport\s+['"][^'"]+['"]\s*;?/g
// Matches: export { foo } and export { foo } from "bar"
const BARE_EXPORT_RE =
  /^export\s*\{[^}]*\}(?:\s*from\s*['"][^'"]+['"])?\s*;?$/gm

type AliasEntry = { find: string; replacement: string }

export function rawBundlePlugin(): Plugin {
  let aliases: AliasEntry[] = []

  return {
    name: "raw-bundle",

    configResolved(config: ResolvedConfig) {
      const raw = config.resolve?.alias
      if (Array.isArray(raw)) {
        aliases = raw.filter((a) => typeof a.find === "string") as AliasEntry[]
      } else if (raw && typeof raw === "object") {
        aliases = Object.entries(raw).map(([find, replacement]) => ({
          find,
          replacement: replacement as string,
        }))
      }
    },

    resolveId(id, importer) {
      if (!id.endsWith(SUFFIX) || !importer) return
      const bare = id.slice(0, -SUFFIX.length)
      const resolved = resolveAnyPath(importer, bare, aliases)
      if (!resolved) return
      return resolved + SUFFIX
    },

    load(id) {
      if (!id.endsWith(SUFFIX)) return
      const filePath = id.slice(0, -SUFFIX.length)
      const files = collectFiles(filePath, aliases)
      for (const f of files) this.addWatchFile(f)
      const bundled = files
        .map((f) => stripImportsAndExports(readFileSync(f, "utf-8")))
        .join("\n\n")
      return `export default ${JSON.stringify(bundled)}`
    },
  }
}

function resolveAlias(spec: string, aliases: AliasEntry[]): string | null {
  for (const { find, replacement } of aliases) {
    if (spec === find || spec.startsWith(find + "/")) {
      return replacement + spec.slice(find.length)
    }
  }
  return null
}

function resolveAnyPath(fromFile: string, spec: string, aliases: AliasEntry[]): string | null {
  if (spec.startsWith("./") || spec.startsWith("../")) {
    const base = resolve(dirname(fromFile), spec)
    if (existsSync(base)) return base
    if (existsSync(base + ".ts")) return base + ".ts"
    return null
  }
  const aliased = resolveAlias(spec, aliases)
  if (aliased) {
    if (existsSync(aliased)) return aliased
    if (existsSync(aliased + ".ts")) return aliased + ".ts"
  }
  return null
}

function collectFiles(entryPath: string, aliases: AliasEntry[]): string[] {
  const visited = new Set<string>()
  const ordered: string[] = []

  function visit(filePath: string): void {
    if (visited.has(filePath)) return
    visited.add(filePath)
    let source: string
    try {
      source = readFileSync(filePath, "utf-8")
    } catch {
      return
    }
    for (const spec of extractImports(source)) {
      const resolved = resolveAnyPath(filePath, spec, aliases)
      if (resolved) visit(resolved)
    }
    ordered.push(filePath)
  }

  visit(entryPath)
  return ordered
}

function extractImports(source: string): string[] {
  IMPORT_FROM_RE.lastIndex = 0
  const specs: string[] = []
  let m: RegExpExecArray | null
  while ((m = IMPORT_FROM_RE.exec(source)) !== null) {
    specs.push(m[1])
  }
  return specs
}

function stripImportsAndExports(source: string): string {
  source = source.replace(IMPORT_FROM_RE, "")
  source = source.replace(IMPORT_SIDE_EFFECT_RE, "")
  source = source.replace(BARE_EXPORT_RE, "")
  // export default function/class → function/class
  source = source.replace(/^export\s+default\s+(function|class)\b/gm, "$1")
  // export function/const/etc → bare declaration
  source = source.replace(
    /^export\s+((?:async\s+)?function|const|let|var|class|type|interface)\b/gm,
    "$1",
  )
  return source.replace(/\n{3,}/g, "\n\n").trim()
}
