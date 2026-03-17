// @ts-nocheck
function setup() {
  createCanvas(windowWidth, windowHeight)
  noStroke()
}

function draw() {
  // make the background nice and pretty
  background(30)
  fill(255, 140, 0)
  ellipse(mouseX, mouseY, 40, 40)
}
