import type { Color } from "p5"
import { colorWithAlpha, multiLerpColors } from "@/lib/colors"

type Star = { x: number; y: number; d: number; color: Color }

const groundHeight = 150
const numStars = 30
const starSpeed = 80
const animTime = 2400 // 3600 is one minute
const stars: Array<Star> = []

let sunColorA: Color
let sunColorB: Color
let sun: Star

let groundGradient: Array<Color>

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
  sunColorA = color(255, 69, 0)
  sunColorB = color(255, 255, 196)
  sun = {
    x: width / 2,
    y: height,
    d: 140,
    color: sunColorA,
  }

  groundGradient = [
    color(13, 13, 33),
    color(13, 33, 25),
    color(24, 54, 34),
    color(108, 148, 85),
  ]
}

function draw() {
  background(12, 20, 50)
  drawStars()
  drawSky()
  drawSun()
  drawGround()

  // move sun
  const mod = height / starSpeed
  if (frameCount % mod === 0) {
    sun.y -= 1
  }
}

// What fraction of the way to 'done' are we? 0..1
function getTimeParam() {
  return min(1, frameCount / animTime)
}

function drawSky() {
  // blue, but opacity varies by time. start transparent, go to full after N frames
  push()
  const a = Math.min(255 * (frameCount / animTime), 255)
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
  // three layered ellipses. They change along with getTimeParam. Orange and
  // dawn-like to start, then progressively more noon-day yellow.
  // dimmest one in back, actual sunball in front
  push()
  noStroke()
  const tp = getTimeParam()
  const timeLeft = 0.5 - tp // makes for full transparency mid-morning
  const currentColor = lerpColor(sunColorA, sunColorB, tp)
  fill(colorWithAlpha(currentColor, lerp(0, 20, timeLeft)))
  ellipse(sun.x, sun.y, width * 2, height)
  fill(colorWithAlpha(currentColor, lerp(0, 40, timeLeft)))
  ellipse(sun.x, sun.y, width * 1.5, height * 0.8)
  fill(currentColor)
  ellipse(sun.x, sun.y, sun.d, sun.d)
  pop()
}

function drawGround() {
  push()
  noStroke()
  const tp = getTimeParam()
  const currentColor = multiLerpColors(groundGradient, tp)
  fill(currentColor)
  rect(0, height - groundHeight, width, groundHeight)
  pop()
}
