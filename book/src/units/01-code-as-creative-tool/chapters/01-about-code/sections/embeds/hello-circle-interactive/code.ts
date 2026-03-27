function setup() {
  createCanvas(50, 50)
}

function draw() {
  background("black")
  if (15 < mouseX && mouseX < 35 && 15 < mouseY && mouseY < 35) {
    fill("#f00")
  } else {
    fill("#888")
  }
  circle(25, 25, 15)
}
