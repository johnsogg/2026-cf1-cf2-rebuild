import type { Color } from "p5"

type Star = { x: number; y: number; d: number; color: Color }

const groundHeight = 150
const numStars = 30
const starSpeed = 80
const skyTime = 2400 // 3600 is one minute
const stars: Array<Star> = []
let sun: Star

function setup() {
  createCanvas(windowWidth, 400)
  for (let i = 0; i < numStars; i++) {
    stars[i] = {
      x: random(0, width),
      y: random(0, height - groundHeight),
      d: random(1, 4),
      color: color(200 + random(-10, 10), random(0, 255)),
    }
  }
  sun = {
    x: width / 2,
    y: height,
    d: 140,
    color: color(255, 148, 77),
  }
}

function draw() {
  background(12, 20, 50)
  drawStars()
  drawSky()
  drawSun()
  fill(20, 12, 32)
  rect(0, height - groundHeight, width, groundHeight)

  // move sun
  const mod = height / starSpeed
  if (frameCount % mod === 0) {
    sun.y -= 1
  }
}

function colorWithAlpha(c: Color, a: number) {
  return color(red(c), green(c), blue(c), a)
}

function drawSky() {
  // blue, but opacity varies by time. start transparent, go to full after N frames
  push()
  const a = Math.min(255 * (frameCount / skyTime), 255)
  fill(0, 153, 255, a)
  rect(0, 0, width, height)
  pop()
}

function drawStars() {
  // stars in top rectangle from origin to (width, height - groundHeight)
  push()
  noStroke()
  for (let i = 0; i < stars.length; i++) {
    const s = stars[i]
    fill(s.color)
    circle(s.x, s.y, s.d)
  }
  pop()
}

function drawSun() {
  // three layered ellipses
  // dimmest one in back, actual sunball in front
  push()
  noStroke()
  fill(colorWithAlpha(sun.color, 20))
  ellipse(sun.x, sun.y, width * 2, height)
  fill(colorWithAlpha(sun.color, 40))
  ellipse(sun.x, sun.y, width * 1.5, height * 0.8)
  fill(sun.color)
  ellipse(sun.x, sun.y, sun.d, sun.d)
  pop()
}
