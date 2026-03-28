import p5Source from "p5/lib/p5.min.js?raw"

export function buildSrcdoc(studentJS: string): string {
  return `<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <style>
      body { margin: 0; overflow: hidden; }
      canvas { display: block; }
    </style>
  </head>
  <body>
    <script>${p5Source}<\/script>
    <script>
      window.onerror = function(msg, _src, line, col, err) {
        parent.postMessage({ type: 'sketch-error', message: err ? err.message : String(msg), line: line, col: col, stack: err ? err.stack : null }, '*');
      };
      try {
        ${studentJS}
      } catch (e) {
        parent.postMessage({ type: 'sketch-error', message: e instanceof Error ? e.message : String(e), stack: e instanceof Error ? e.stack : null }, '*');
      }
    <\/script>
  </body>
</html>`
}
