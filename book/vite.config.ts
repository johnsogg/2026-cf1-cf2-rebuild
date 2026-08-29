import { defineConfig } from "vite"
import mdx from "@mdx-js/rollup"
import react from "@vitejs/plugin-react"
import remarkGfm from "remark-gfm"
import remarkMath from "remark-math"
import rehypeHighlight from "rehype-highlight"
import rehypeKatex from "rehype-katex"
import rehypeSlug from "rehype-slug"
import rehypeAutolinkHeadings from "rehype-autolink-headings"
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
  base: "/",
  build: {
    outDir: "../docs",
    emptyOutDir: true,
  },
  optimizeDeps: {
    exclude: ["p5/lib/p5.min.js?raw"],
  },
  resolve: {
    alias: {
      immerse: fileURLToPath(new URL("../immerse/src", import.meta.url)),
      "@": fileURLToPath(new URL("./src", import.meta.url)),
      // p5 v2's package.json "exports" map doesn't list this file, even
      // though it still ships it — alias around the restriction so the
      // global-mode UMD build can be inlined into the sketch iframe.
      "p5/lib/p5.min.js?raw": `${fileURLToPath(
        new URL("../node_modules/p5/lib/p5.min.js", import.meta.url),
      )}?raw`,
    },
  },
  plugins: [
    rawBundlePlugin(),
    {
      enforce: "pre",
      ...mdx({
        remarkPlugins: [remarkGfm, remarkMath, remarkWordCount, remarkP5Sketch, remarkP5Exercise, remarkJsConsole],
        rehypePlugins: [
          rehypeSlug,
          [
            rehypeAutolinkHeadings,
            {
              behavior: "append",
              test: ["h2", "h3"],
              properties: { className: ["heading-anchor"], ariaLabel: "Link to this section" },
              content: { type: "text", value: "#" },
            },
          ],
          rehypeHighlight,
          rehypeKatex,
        ],
        providerImportSource: "@mdx-js/react",
      }),
    },
    react({ include: /\.(jsx|js|mdx|md|tsx|ts)$/ }),
    exerciseCountPlugin(),
    ...(command === "build" ? [copy404Plugin] : []),
  ],
}))
