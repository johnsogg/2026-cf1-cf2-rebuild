import { defineConfig } from "vite"
import mdx from "@mdx-js/rollup"
import react from "@vitejs/plugin-react"
import remarkGfm from "remark-gfm"
import rehypeHighlight from "rehype-highlight"
import rehypeSlug from "rehype-slug"
import { fileURLToPath } from "node:url"
import { copyFileSync } from "node:fs"
import { exerciseCountPlugin } from "./src/plugins/exerciseCountPlugin"
import { remarkWordCount } from "../immerse/src/plugins/remarkWordCount"
import { remarkP5Sketch } from "../immerse/src/plugins/remarkP5Sketch"
import { remarkP5Exercise } from "../immerse/src/plugins/remarkP5Exercise"
import { remarkJsConsole } from "../immerse/src/plugins/remarkJsConsole"
import { rawBundlePlugin } from "../immerse/src/plugins/rawBundlePlugin"

const copy404Plugin = {
  name: "copy-index-to-404",
  closeBundle() {
    copyFileSync("../docs/index.html", "../docs/404.html")
  },
}

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
        remarkPlugins: [remarkGfm, remarkWordCount, remarkP5Sketch, remarkP5Exercise, remarkJsConsole],
        rehypePlugins: [rehypeSlug, rehypeHighlight],
        providerImportSource: "@mdx-js/react",
      }),
    },
    react({ include: /\.(jsx|js|mdx|md|tsx|ts)$/ }),
    exerciseCountPlugin(),
    ...(command === "build" ? [copy404Plugin] : []),
  ],
}))
