import type { GlossaryEntry } from "immerse/components/Glossary"

export const glossaryEntries: GlossaryEntry[] = [
  {
    term: ["recursion"],
    definition: `See recursion`,
  },
  {
    term: ["static types", "static type"],
    definition: `A static type is an annotation provided in the source code that tells the compiler or runtime kind of information is present, such as a string, a number, a list, or an object. This can help catch bugs before your code runs.`,
  },
  {
    term: ["variable", "variables"],
    definition: `A named container that holds a value. Despite the name, not all variables are allowed to change. Variables declared with "let" can be re-assigned; variables declared with "const" can not.`,
  },
  {
    term: ["string"],
    definition: `A sequence of characters (letters, numbers, symbols, emoji). Example: "I love pie!!1! 🥰 🥧`,
  },
  {
    term: ["literal"],
    definition: `A directly evaluable passage of code such as a number, a string, or an object. Examples: 37, "Rick Blaine", { name: "Richard Blaine", age: 37 }`,
  },
]
