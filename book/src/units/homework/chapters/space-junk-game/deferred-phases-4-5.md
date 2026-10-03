<!-- Phases 4 and 5 cut from the first Space Junk homework (description.mdx) on 2026-10-03. Kept here for the local-development edition. -->

## Phase 4: Carry and deliver (2 points)

- Goal: caught junk rides under the Magpie; bring it to the Mothership to score
- You'll edit: `Magpie.captureJunk`, the cargo drawing in `Magpie.draw`,
  `Game.resolveDropoff`, `Game.updateScore`
- Given: `Magpie.move` keeps the carried junk's position in sync with where it's
  drawn

### Spec

- Capturing junk stores it on the Magpie and switches the beam off. Even if
  Space is still held, the beam stays off until the junk is delivered. If Space
  is still held at that point, the beam comes right back on.
- Only one piece of junk at a time
- Carried junk is drawn underneath the Magpie, at `(0, Magpie.CARGO_Y)` in the
  ship's rotated frame, and drawn before the ship
- The Mothership has a junk-attracting field around it that is always on: a
  circle `Mothership.PICKUP_DIAMETER` across, centered on the Mothership. (Debug
  mode draws it.)
- Delivering: carried junk tracks `dropoffTime`, how long it has been in the
  field, using the same go-up/drain-down rule as `beamTime`
  - Delivered when `dropoffTime` passes `Game.JUNK_DROPOFF_TIME_MS`
  - Use p5's `dist()` to check if the junk is inside the circle
- Each delivery scores `Game.SCORE_DROPOFF` points
- The level is complete when no junk is left floating and none is being carried
  (given)
- Image: the Phase 4 build in debug mode, with the Magpie carrying junk at
  `CARGO_Y` near the Mothership's pickup circle

### Done when

- Caught junk follows under the Magpie and turns with it
- The beam won't come on while carrying
- Hovering the junk over the Mothership for about a second delivers it, and the
  score goes up (check with `console.log` until Phase 5 shows it)
- Delivering all the junk shows "All clear!"

## Phase 5: Timer, score, and lives (2 points)

- Goal: the on-screen display (the "HUD")
- You'll edit: `Level.timeLeft`, the HUD part of `Level.draw`,
  `timeToStringParts`
- Drawn first, before the junk, so everything else draws on top of it

### Timer

The timer starts out at the level's starting time and counts down one second at
a time. It is rendered in large, easy-to-read text. It is fixed to the top left
of the screen, and should be rendered _under_ any other objects that might
happen to occupy the same space.

- The starting time is `Game.LEVEL.time` (ms)
- `Level.timeLeft()`: starting time minus elapsed time, never below 0 (the given
  `Level.move` already adds up elapsed time)
- Shown as `minutes:seconds`, like `1:05`. Seconds always have two digits.
- `timeToStringParts(ms)` rounds _up_ to whole seconds, so the display reads
  `2:00` at the start, not `1:59`
- Text size: `Level.HUD_TEXT_SIZE`, padded `Level.HUD_PAD` from the corner
- The timer stops when the level is complete or the game is paused (given)
- Nothing happens when it reaches `0:00` in this version

### Score

The player score is rendered in the same text style as the timer. It is on the
top right side of the screen. The goal is to make this number go up.

- Right-aligned, so it grows leftward as it gets bigger

### Lives

The Mothership has spare Magpies in its hull. The lives counter is rendered at
the bottom left, and displays icon-sized versions of the Magpie. When the player
is on their last Magpie, none are shown at all. For example, when the player
starts with `Game.DEFAULT_NUM_LIVES`, there are `Game.DEFAULT_NUM_LIVES - 1`
little icons in that area.

- Reuse `Magpie.drawMagpie()`: translate, then scale by `Level.LIVES_SCALE`
- Placed using `Level.LIVES_PAD_LEFT`, `Level.LIVES_PAD_BOTTOM`,
  `Level.LIVES_GAP`
- Lives never go down in this version, but draw from `lives` anyway
- Image: the finished HUD (`phase-builds/phase-5`) with `HUD_PAD` and the lives
  spacing annotated

### Done when

- Timer counts down from the level's starting time and stops on "All clear!"
- Score shows and goes up with each delivery
- Two small Magpies at the bottom left (with the default three lives)
