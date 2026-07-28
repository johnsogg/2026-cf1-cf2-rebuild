import { visit } from "unist-util-visit"
import type { Root, Code, Parent } from "mdast"

function parseMeta(meta: string | null | undefined) {
  const str = meta ?? ""
  const sizeMatch = str.match(/\bsize="([^"]*)"/)
  const hoverInfoMatch = str.match(/\bhoverInfo="([^"]*)"/)
  return {
    size: sizeMatch?.[1] as "small" | "medium" | "large" | undefined,
    autorun: /\bautorun\b/.test(str),
    hoverInfo: hoverInfoMatch ? hoverInfoMatch[1] !== "false" : undefined,
    hasObsoleteAttrs: /\b(id|title|solutionTo)="/.test(str),
  }
}

function makeStringProp(name: string, value: string) {
  return {
    type: "Property",
    key: { type: "Identifier", name },
    value: { type: "Literal", value, raw: JSON.stringify(value) },
    kind: "init",
    computed: false,
    shorthand: false,
    method: false,
  }
}

function makeBoolProp(name: string, value = true) {
  return {
    type: "Property",
    key: { type: "Identifier", name },
    value: { type: "Literal", value, raw: String(value) },
    kind: "init",
    computed: false,
    shorthand: false,
    method: false,
  }
}

function makeExerciseAttr(
  initialCode: string,
  size?: string,
  autorun?: boolean,
  hoverInfo?: boolean,
) {
  const properties = [
    ...(size != null ? [makeStringProp("size", size)] : []),
    ...(autorun ? [makeBoolProp("autorun")] : []),
    ...(hoverInfo != null ? [makeBoolProp("hoverInfo", hoverInfo)] : []),
    makeStringProp("initialCode", initialCode),
  ]

  return {
    type: "mdxJsxAttribute",
    name: "exercise",
    value: {
      type: "mdxJsxAttributeValueExpression",
      value: `{ initialCode: ${JSON.stringify(initialCode)} }`,
      data: {
        estree: {
          type: "Program",
          body: [
            {
              type: "ExpressionStatement",
              expression: {
                type: "ObjectExpression",
                properties,
              },
            },
          ],
          sourceType: "module",
        },
      },
    },
  }
}

/**
 * Shared implementation behind the `p5exercise`/`jsconsole` fence types.
 * Presentation-only: no `id`/`title`/`solutionTo` — identity and chrome
 * now live on the wrapping `<Ask>`/`<Solution>`, not the fence itself.
 */
export function makeExerciseFencePlugin(lang: string, componentName: string) {
  return function remarkExerciseFencePlugin() {
    return (tree: Root) => {
      visit(
        tree,
        "code",
        (node: Code, index: number | undefined, parent: Parent | undefined) => {
          if (node.lang !== lang || !parent || index == null) return

          const { size, autorun, hoverInfo, hasObsoleteAttrs } = parseMeta(
            node.meta,
          )
          if (hasObsoleteAttrs) {
            console.warn(
              `[${lang}] id=/title=/solutionTo= on the fence are ignored — wrap it in <Ask id="..." mode="..." title="..."> instead`,
            )
          }

          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const attributes: any[] = [
            makeExerciseAttr(node.value, size, autorun, hoverInfo),
          ]

          parent.children.splice(index, 1, {
            type: "mdxJsxFlowElement",
            name: componentName,
            attributes,
            children: [],
          } as any)
        },
      )
    }
  }
}
