import type { Color } from "p5"
import { colorWithAlpha, multiLerpColors } from "@/lib/colors"
import { drawFlower } from "@/lib/flower"

type Star = { x: number; y: number; d: number; color: Color }
type Flower = { x: number; y: number }
type Cloud = {
  x: number
  y: number
  size: number
  saturation: number
  speed: number
}

const groundHeight = 150
const numStars = 30
const starSpeed = 80
const animTime = 2400 // 3600 is one minute
const stars: Array<Star> = []
const flowers: Array<Flower> = []
const clouds: Array<Cloud> = []

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
  // for (let i = 0; i < numFlowers; i++) {
  //   flowers[i] = {
  //     x: random(0, width),
  //     // flower graphic is 50px high so ensure entire thing is visible
  //     y: random(height - (groundHeight + 50), height - 50),
  //   }
  // }
  // // order by y so that flowers "in back" are drawn first, for better layering
  // flowers.sort((a, b) => a.y - b.y)

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
  drawFlowers()
  drawClouds()

  // move sun
  const mod = height / starSpeed
  if (frameCount % mod === 0) {
    sun.y -= 1
  }

  // move clouds
  for (let i = 0; i < clouds.length; i++) {
    clouds[i].x += clouds[i].speed
    // loop clouds back to left once they are fully off-screen on the right.
    // place them at the same height and just to the left of the screen so
    // they are not yet visible at all.
    if (clouds[i].x - clouds[i].size > width) {
      clouds[i].x = -clouds[i].size
    }
  }
}

// handle mouse click to add flowers (if clicking in the ground area) or
// clouds (if clicking in the sky area)
function mouseClicked() {
  // check if in ground
  if (mouseY >= height - groundHeight) {
    // add a flower, centered on the click (flower graphic is 50px wide/high)
    flowers.push({ x: mouseX - 25, y: mouseY - 25 })
    // order by y so that flowers "in back" are drawn first, for better layering
    flowers.sort((a, b) => a.y - b.y)
  }
  // only other alternative is the sky
  else {
    clouds.push({
      x: mouseX,
      y: mouseY,
      size: random(50, 150),
      saturation: random(), // 0..1, for how white vs gray the cloud is
      speed: random(0.2, 1), // how fast the cloud moves across the sky
    })
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

function drawFlowers() {
  for (let i = 0; i < flowers.length; i++) {
    push()
    translate(flowers[i].x, flowers[i].y)
    drawFlower({})
    pop()
  }
}

function drawClouds() {
  for (let i = 0; i < clouds.length; i++) {
    const c = clouds[i]
    push()
    noStroke()
    // Cloud will be somewhere between white (saturation=0) and gray
    // (saturation=1). Also because the daylight creeps in, we don't want
    // shock white clouds early on. So the opacity is based on getTimeParam.
    // Just do a linear transform of the current time param (0..1) to opacity
    // value (25..200)
    const tp = getTimeParam()
    const opacity = lerp(25, 200, tp)
    fill(colorWithAlpha(color(255 - c.saturation * 100), opacity))
    ellipse(c.x, c.y, c.size, c.size * 0.6)
    pop()
  }
}
