import { visit } from 'unist-util-visit'
import type { Root } from 'mdast'

export function remarkWordCount() {
  return (tree: Root) => {
    let words = 0
    visit(tree, 'text', (node) => {
      words += node.value.trim().split(/\s+/).filter(Boolean).length
    })
    tree.children.push({
      type: 'mdxjsEsm',
      value: `export const wordCount = ${words}`,
      data: {
        estree: {
          type: 'Program',
          body: [{
            type: 'ExportNamedDeclaration',
            declaration: {
              type: 'VariableDeclaration',
              kind: 'const',
              declarations: [{
                type: 'VariableDeclarator',
                id: { type: 'Identifier', name: 'wordCount' },
                init: { type: 'Literal', value: words }
              }]
            },
            specifiers: [],
            source: null
          }],
          sourceType: 'module'
        }
      }
    } as any)
  }
}
