import p5Source from "p5/lib/p5.min.js?raw"
// Vendored rather than npm-installed: the p5.sound package wrongly lists its
// doc generator (yuidocjs → express, etc.) as runtime dependencies.
import p5SoundSource from "../vendor/p5.sound-0.4.1.min.js?raw"

export function buildSrcdoc(
  studentJS: string,
  { sound = false }: { sound?: boolean } = {},
): string {
  // Student code runs as a top-level script (not inside a try block) so that
  // `async function setup()` becomes a global p5 can find — only plain
  // function declarations get hoisted out of blocks. window.onerror still
  // reports top-level exceptions, and unhandledrejection covers failures
  // inside async setup (e.g. a missing asset file).
  return `<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <style>
      body { margin: 0; overflow: hidden; }
      canvas { display: block; }
      /* Full-screen sketch mode: center the canvas and scale it to fit. */
      body.fit {
        height: 100vh;
        display: flex;
        align-items: center;
        justify-content: center;
      }
    </style>
  </head>
  <body>
    <script>${p5Source}<\/script>
    ${sound ? `<script>${p5SoundSource}<\/script>` : ""}
    <script>
      window.onerror = function(msg, _src, line, col, err) {
        parent.postMessage({ type: 'sketch-error', message: err ? err.message : String(msg), line: line, col: col, stack: err ? err.stack : null }, '*');
      };
      window.onunhandledrejection = function(e) {
        var err = e.reason;
        parent.postMessage({ type: 'sketch-error', message: err instanceof Error ? err.message : String(err), stack: err instanceof Error ? err.stack : null }, '*');
      };
      // This document can't scroll, so the browser hands arrow/space scrolling
      // up to the book page. Suppress that while the sketch has focus — p5
      // still sees the keydown — except inside form fields (createInput, etc.).
      var scrollKeys = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Space'];
      window.addEventListener('keydown', function(e) {
        var t = e.target;
        var editable = t && (t.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName));
        if (!editable && scrollKeys.indexOf(e.code) !== -1) e.preventDefault();
        // Let the book close a full-screen takeover even while the sketch has
        // focus. p5 still sees the key, too.
        if (e.key === 'Escape') parent.postMessage({ type: 'sketch-escape' }, '*');
      });
      // The book turns fit mode on and off with { type: 'immerse-fit', fit }.
      // A CSS transform scales the canvas without touching its real size, and
      // p5 accounts for it when reporting mouseX/mouseY.
      var fit = false;
      function applyFit() {
        var c = document.querySelector('canvas');
        if (!c) return;
        var k = Math.min(innerWidth / c.offsetWidth, innerHeight / c.offsetHeight);
        c.style.transform = fit ? 'scale(' + k + ')' : '';
      }
      window.addEventListener('message', function(e) {
        if (e.data && e.data.type === 'immerse-fit') {
          fit = !!e.data.fit;
          document.body.classList.toggle('fit', fit);
          applyFit();
        }
      });
      window.addEventListener('resize', applyFit);
      // The canvas may not exist yet (it's made in setup), so watch for it.
      new MutationObserver(applyFit).observe(document.documentElement, { childList: true, subtree: true });
    <\/script>
    <script>
${studentJS}
    <\/script>
  </body>
</html>`
}
