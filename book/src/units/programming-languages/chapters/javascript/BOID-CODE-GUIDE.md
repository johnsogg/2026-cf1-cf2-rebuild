# Boid Code Guide

Conventions for every Boid sketch in the Classes section (and anything else
built on Boids). The 2024 originals live on the p5 editor; see `classes.mdx`
for links. When porting one, follow this file, not the original.

The reference for "how we write game-ish p5 code" is the Space Junk homework
(`units/homework/chapters/space-junk-game/sections/embeds/phase-1/`). Boids
should feel like a smaller version of it, so students see the same shapes
twice.

## Platform

- **p5.js v2.** The book bundles `p5@^2.3.2`. No `preload`, no `p5.sound`.
- p5 web editor copies use this `index.html`:

  ```html
  <!DOCTYPE html>
  <!-- noprotect -->
  <html lang="en">
    <head>
      <script src="https://cdn.jsdelivr.net/npm/p5@2/lib/p5.min.js"></script>
      <link rel="stylesheet" type="text/css" href="style.css" />
      <meta charset="utf-8" />
    </head>
    <body>
      <main></main>
      <script src="sketch.js"></script>
    </body>
  </html>
  ```

  `<!-- noprotect -->` is required: the editor's loop protection silently
  breaks sketches that use class fields together with loops.

## Formatting

- Follow the repo `.prettierrc`: **no semicolons**, 80 columns, double quotes.
- Comments explain _why_ or name units. Fine to keep them chatty, since the
  code is teaching material, but the section prose belongs to the author, not
  the code comments.

## Time: `delta`, never `frameCount`

These sketches run at interactive speed, so time comes from the clock.

- `draw()` computes `delta` once and passes it down, clamped like Space Junk
  so a backgrounded tab doesn't teleport everything:

  ```js
  const MAX_DELTA_MS = 50

  function draw() {
    const delta = Math.min(deltaTime, MAX_DELTA_MS)
    background("black")
    for (const boid of boids) {
      boid.move(delta)
    }
    // ... notice, then draw
  }
  ```

- **`delta` is milliseconds. Velocities are pixels per second.** Convert at
  the point of use: `this.x += this.dx * (delta / 1000)`.
- `delta` goes to `move(delta)` (state change), not `draw()` (rendering).
  That matches Space Junk, Godot's `_process(delta)` and `_physics_process`,
  and Unity's `Update`/`Time.deltaTime`. `draw()` takes no time argument.
- Timestamps (e.g. trail dots) use `millis()`. Periodic events use an
  accumulator (`this.sinceTrailMs += delta`), not `frameCount % N`.
- No `frameRate()` calls.

## Sizes: diameter, not radius

p5's `circle(x, y, d)` takes a **diameter**. The 2024 Boids named it `rad`,
so many calculations are off by a factor of two.

- Name it `diameter` (or `DIAMETER` for a constant). If a radius is needed,
  derive it right there: `const radius = this.diameter / 2`.
- Distance thresholds (like noticing other boids) are **radii**, because
  they're compared against a center-to-center distance. Name them that way:
  `NOTICE_RADIUS`. Draw them with `circle(x, y, 2 * NOTICE_RADIUS)`.

## Classes

- **Constants are `static` SCREAMING_CASE fields** on the class that owns
  them, referenced through the class name (`Boid.MAX_SPEED`, not
  `this.MAX_SPEED`). Units in the name or a doc comment, as in Space Junk:
  `static TRAIL_INTERVAL_MS = 230`.
- Sketch-wide constants (like `MAX_DELTA_MS`) can stay top-level `const`
  SCREAMING_CASE.
- Declare instance fields at the top of the class (with a short `/** */`
  comment when the meaning isn't obvious), then assign them in the
  `constructor`. Same as Space Junk.
- Methods: `draw()`, `move(delta)`, plus behavior verbs (`notice(other)`).
  Use `push()`/`pop()` in any method that changes drawing state.
- Avoid reading sketch-level mutable globals from inside the class where it's
  easy. A debug flag is acceptable (Space Junk reads `game.debug`).

## Loops and math

- Use `for (const boid of boids)` whenever the index isn't needed. No
  `forEach`.
- Use indexed `for` only when the index matters (e.g. the "every pair except
  itself" loop, or building N things from an array of colors).
- Use `Math.*` built-ins over p5 equivalents: `Math.hypot`, `Math.min`,
  `Math.max`, `Math.abs`, `Math.sqrt`, `Math.PI`. Don't use p5's `dist`,
  `min`, `max`, `abs`, `sqrt`, `PI`.
- p5-only helpers with no `Math` equivalent are fine: `random(lo, hi)`,
  `map`, `constrain`, `createVector` and its methods.
- Don't name locals after p5 globals (`dist`, `width`, `height`, `color`,
  `fill`). Space Junk uses `w`/`h` for this reason.

## Porting numbers from the 2024 Boids

The originals ran at 60 fps with per-frame units. To keep the same feel:

| 2024 value | Meaning | New value |
|---|---|---|
| `dx = random(-1, 1)` | px/frame | `random(-60, 60)` px/s |
| speed limit `3.5` | px/frame | `MAX_SPEED = 210` px/s |
| steering nudge `limit(0.01)` per frame | px/frame² | `STEER = 36` px/s², applied as `limit(Boid.STEER * delta / 1000)` |
| `rad` passed to `circle` | was really diameter | `diameter` (same number) |
| `noticeRad = 4 * rad` compared to distance | a radius, 4× the diameter | `NOTICE_RADIUS = 4 * diameter` (keeps behavior; fix the debug circle to draw `2 * NOTICE_RADIUS`) |
| `bubbleCaptureRate = 14` frames | ~233 ms | `TRAIL_INTERVAL_MS = 230` |
| `maxAge = 20 * 14` frames | ~4.7 s | `TRAIL_MAX_AGE_MS = Boid.NUM_TRAIL_DOTS * Boid.TRAIL_INTERVAL_MS` |

Edge wrapping (drawing ghost copies near the edges) should test against the
real radius, `diameter / 2`.
