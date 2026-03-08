import type { GlossaryEntry } from 'immerse/components/Glossary'

export const glossaryEntries: GlossaryEntry[] = [
  {
    term: ['variable', 'variables'],
    definition: `A named container that holds a value. Despite the name, not all variables are allowed to change. Variables declared with "let" can be re-assigned; variables declared with "const" can not.`,
  },
  {
    term: ['static types', 'static type'],
    definition: `A static type is an annotation provided in the source code that tells the compiler or runtime kind of information is present, such as a string, a number, a list, or an object. This can help catch bugs before your code runs.`,
  },
  {
    term: ['recursion'],
    definition: `See recursion`,
  },
]
