import { defineConfig } from 'vite'
import mdx from '@mdx-js/rollup'
import react from '@vitejs/plugin-react'
import remarkGfm from 'remark-gfm'
import rehypeHighlight from 'rehype-highlight'
import { fileURLToPath } from 'node:url'

export default defineConfig({
  base: '/2026-cf1-cf2-rebuild/',
  build: {
    outDir: '../docs',
    emptyOutDir: true,
  },
  resolve: {
    alias: {
      immerse: fileURLToPath(new URL('../immerse/src', import.meta.url)),
    },
  },
  plugins: [
    {
      enforce: 'pre',
      ...mdx({ remarkPlugins: [remarkGfm], rehypePlugins: [rehypeHighlight], providerImportSource: '@mdx-js/react' }),
    },
    react({ include: /\.(jsx|js|mdx|md|tsx|ts)$/ }),
  ],
})
