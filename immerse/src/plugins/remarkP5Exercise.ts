import { visit } from "unist-util-visit"
import type { Root, Code, Parent } from "mdast"

function parseMeta(meta: string | null | undefined) {
  const str = meta ?? ""
  const idMatch = str.match(/\bid="([^"]*)"/)
  const titleMatch = str.match(/\btitle="([^"]*)"/)
  const sizeMatch = str.match(/\bsize="([^"]*)"/)
  const hoverInfoMatch = str.match(/\bhoverInfo="([^"]*)"/)
  return {
    id: idMatch?.[1],
    title: titleMatch?.[1],
    size: sizeMatch?.[1] as "small" | "medium" | "large" | undefined,
    autorun: /\bautorun\b/.test(str),
    hoverInfo: hoverInfoMatch ? hoverInfoMatch[1] !== "false" : undefined,
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

function makeExerciseAttr(id: string, initialCode: string, title?: string, size?: string, autorun?: boolean, hoverInfo?: boolean) {
  const properties = [
    makeStringProp("type", "p5"),
    makeStringProp("id", id),
    ...(title != null ? [makeStringProp("title", title)] : []),
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
      value: `{ type: "p5", id: ${JSON.stringify(id)} }`,
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

export function remarkP5Exercise() {
  return (tree: Root) => {
    visit(tree, "code", (node: Code, index: number | undefined, parent: Parent | undefined) => {
      if (node.lang !== "p5exercise" || !parent || index == null) return

      const { id, title, size, autorun, hoverInfo } = parseMeta(node.meta)
      if (!id) {
        console.warn("[remarkP5Exercise] missing required id= attribute, skipping fence")
        return
      }

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const attributes: any[] = [makeExerciseAttr(id, node.value, title, size, autorun, hoverInfo)]

      parent.children.splice(index, 1, {
        type: "mdxJsxFlowElement",
        name: "Exercise",
        attributes,
        children: [],
      } as any)
    })
  }
}
