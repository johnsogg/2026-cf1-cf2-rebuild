import tseslint from 'typescript-eslint'
import reactHooks from 'eslint-plugin-react-hooks'
import globals from 'globals'

import noBookImportsInImmerse from './eslint-rules/no-book-imports-in-immerse.mjs'
import glossaryAlphabetical from './eslint-rules/glossary-alphabetical.mjs'

const customPlugin = {
  rules: {
    'no-book-imports-in-immerse': noBookImportsInImmerse,
    'glossary-alphabetical': glossaryAlphabetical,
  },
}

export default tseslint.config(
  // ── Ignore generated / legacy directories ──────────────────────────────────
  {
    ignores: [
      '**/node_modules/**',
      'docs/**',
      'lesson-poc/**',
      'webworker-poc/**',
      'historical-resources/**',
    ],
  },

  // ── TypeScript baseline for both packages ──────────────────────────────────
  {
    files: ['immerse/src/**/*.{ts,tsx}', 'book/src/**/*.{ts,tsx}'],
    extends: [tseslint.configs.recommended],
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.es2022,
      },
    },
    plugins: {
      'react-hooks': reactHooks,
    },
    rules: {
      // tsc already enforces unused locals/params — avoid duplicate noise
      '@typescript-eslint/no-unused-vars': 'off',
      // Ternary-as-statement is a valid compact if/else idiom
      '@typescript-eslint/no-unused-expressions': ['error', { allowTernary: true }],
      // React hooks correctness
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',
    },
  },

  // ── Exercise files: allow @ts-nocheck (starters are intentionally incomplete) ─
  {
    files: ['book/src/**/exercises/**'],
    rules: {
      '@typescript-eslint/ban-ts-comment': 'off',
    },
  },

  // ── Custom rule: immerse must never import from book ───────────────────────
  {
    files: ['immerse/src/**/*.{ts,tsx}'],
    plugins: { custom: customPlugin },
    rules: {
      'custom/no-book-imports-in-immerse': 'error',
    },
  },

  // ── Custom rule: glossary entries must be alphabetical ─────────────────────
  {
    files: ['book/src/glossary.ts'],
    plugins: { custom: customPlugin },
    rules: {
      'custom/glossary-alphabetical': 'error',
    },
  },
)
