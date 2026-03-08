import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const bookDir = path.resolve(__dirname, '..', 'book')

/**
 * ESLint rule: files inside immerse/src/ must never import from book/.
 * Catches both package-name imports ('book', 'book/...') and relative
 * path imports that resolve into the book directory.
 */
export default {
  meta: {
    type: 'problem',
    docs: {
      description: 'Prevent immerse from importing book internals. Dependencies must flow one way: book → immerse.',
    },
    messages: {
      noBookImports:
        'immerse must not import from book. Keep dependencies flowing one way: book → immerse.',
    },
    schema: [],
  },
  create(context) {
    return {
      ImportDeclaration(node) {
        const importPath = node.source.value

        // Block package-name imports: 'book' or 'book/...'
        if (importPath === 'book' || importPath.startsWith('book/')) {
          context.report({ node: node.source, messageId: 'noBookImports' })
          return
        }

        // Block relative imports that resolve into book/
        if (importPath.startsWith('.')) {
          const filename = context.filename
          const resolved = path.resolve(path.dirname(filename), importPath)
          if (resolved.startsWith(bookDir + path.sep) || resolved === bookDir) {
            context.report({ node: node.source, messageId: 'noBookImports' })
          }
        }
      },
    }
  },
}
