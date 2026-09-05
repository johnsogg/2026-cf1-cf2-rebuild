import { visit } from "unist-util-visit"
import type { Root, Code, Parent } from "mdast"

function parseMeta(meta: string | null | undefined) {
  const str = meta ?? ""
  const autoplay = /\bautoplay\b/.test(str)
  const allowReset = /\ballowReset\b/.test(str)
  const wide = /\bwide\b/.test(str)
  const widthMatch = str.match(/\bwidth=(\d+)\b/)
  const heightMatch = str.match(/\bheight=(\d+)\b/)
  return {
    autoplay,
    allowReset,
    wide,
    width: widthMatch ? parseInt(widthMatch[1], 10) : undefined,
    height: heightMatch ? parseInt(heightMatch[1], 10) : undefined,
  }
}

function makeDimensionsAttr(width: number, height: number) {
  return {
    type: "mdxJsxAttribute",
    name: "dimensions",
    value: {
      type: "mdxJsxAttributeValueExpression",
      value: `{ width: ${width}, height: ${height} }`,
      data: {
        estree: {
          type: "Program",
          body: [
            {
              type: "ExpressionStatement",
              expression: {
                type: "ObjectExpression",
                properties: [
                  {
                    type: "Property",
                    key: { type: "Identifier", name: "width" },
                    value: { type: "Literal", value: width, raw: String(width) },
                    kind: "init",
                    computed: false,
                    shorthand: false,
                    method: false,
                  },
                  {
                    type: "Property",
                    key: { type: "Identifier", name: "height" },
                    value: { type: "Literal", value: height, raw: String(height) },
                    kind: "init",
                    computed: false,
                    shorthand: false,
                    method: false,
                  },
                ],
              },
            },
          ],
          sourceType: "module",
        },
      },
    },
  }
}

export function remarkP5Sketch() {
  return (tree: Root) => {
    visit(tree, "code", (node: Code, index: number | undefined, parent: Parent | undefined) => {
      if (node.lang !== "p5sketch" || !parent || index == null) return

      const { autoplay, allowReset, wide, width, height } = parseMeta(node.meta)

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const attributes: any[] = [
        { type: "mdxJsxAttribute", name: "code", value: node.value },
        { type: "mdxJsxAttribute", name: "layout", value: wide ? "wide" : "content" },
      ]

      if (autoplay) {
        attributes.push({ type: "mdxJsxAttribute", name: "autoplay", value: null })
      }

      if (allowReset) {
        attributes.push({ type: "mdxJsxAttribute", name: "allowReset", value: null })
      }

      if (width != null || height != null) {
        attributes.push(makeDimensionsAttr(width ?? 400, height ?? 400))
      }

      parent.children.splice(index, 1, {
        type: "mdxJsxFlowElement",
        name: "P5Sketch",
        attributes,
        children: [],
      } as any)
    })
  }
}
