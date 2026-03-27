import { defineConfig } from "vite"
import mdx from "@mdx-js/rollup"
import react from "@vitejs/plugin-react"
import remarkGfm from "remark-gfm"
import rehypeHighlight from "rehype-highlight"
import { fileURLToPath } from "node:url"
import { exerciseCountPlugin } from "./src/plugins/exerciseCountPlugin"
import { remarkWordCount } from "../immerse/src/plugins/remarkWordCount"
import { remarkP5Sketch } from "../immerse/src/plugins/remarkP5Sketch"
import { rawBundlePlugin } from "../immerse/src/plugins/rawBundlePlugin"

export default defineConfig(({ command }) => ({
  base: command === "build" ? "/2026-cf1-cf2-rebuild/" : "/",
  build: {
    outDir: "../docs",
    emptyOutDir: true,
  },
  resolve: {
    alias: {
      immerse: fileURLToPath(new URL("../immerse/src", import.meta.url)),
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  plugins: [
    rawBundlePlugin(),
    {
      enforce: "pre",
      ...mdx({
        remarkPlugins: [remarkGfm, remarkWordCount, remarkP5Sketch],
        rehypePlugins: [rehypeHighlight],
        providerImportSource: "@mdx-js/react",
      }),
    },
    react({ include: /\.(jsx|js|mdx|md|tsx|ts)$/ }),
    exerciseCountPlugin(),
  ],
}))
