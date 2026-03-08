/**
 * ESLint rule: glossaryEntries array must be sorted alphabetically by the
 * first string in each entry's `term` array (case-insensitive).
 *
 * Structure expected in glossary.ts:
 *   export const glossaryEntries: GlossaryEntry[] = [
 *     { term: ['alpha', ...], definition: '...' },
 *     { term: ['beta', ...],  definition: '...' },
 *   ]
 */
export default {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'Glossary entries must be sorted alphabetically by their first term (case-insensitive).',
    },
    messages: {
      outOfOrder:
        '"{{current}}" should come before "{{previous}}" — glossary entries must be in alphabetical order.',
    },
    schema: [],
  },
  create(context) {
    return {
      VariableDeclarator(node) {
        // Only look at `glossaryEntries = [...]`
        if (
          node.id.type !== 'Identifier' ||
          node.id.name !== 'glossaryEntries' ||
          !node.init ||
          node.init.type !== 'ArrayExpression'
        ) {
          return
        }

        const elements = node.init.elements.filter((el) => el !== null)

        // Extract the primary (first) term string from each entry
        const terms = elements.map((el) => {
          if (el.type !== 'ObjectExpression') return null
          const termProp = el.properties.find(
            (p) =>
              p.type === 'Property' &&
              p.key.type === 'Identifier' &&
              p.key.name === 'term',
          )
          if (!termProp || termProp.value.type !== 'ArrayExpression') return null
          const first = termProp.value.elements[0]
          if (!first || first.type !== 'Literal' || typeof first.value !== 'string') return null
          return first.value
        })

        // Report the first element that is out of alphabetical order
        for (let i = 1; i < terms.length; i++) {
          if (terms[i] === null || terms[i - 1] === null) continue
          if (terms[i].localeCompare(terms[i - 1], undefined, { sensitivity: 'base' }) < 0) {
            context.report({
              node: elements[i],
              messageId: 'outOfOrder',
              data: { current: terms[i], previous: terms[i - 1] },
            })
          }
        }
      },
    }
  },
}
