const colors = [
  "#7AB8D4",
  "#C4621D",
  "#E8C84A",
  "#C8D5B0",
  "#8B5E3C",
  "#F0EBE0",
]

let idx = 0
let inside = false

function setup() {
  createCanvas(50, 50)
}

function draw() {
  background("black")
  if (15 < mouseX && mouseX < 35 && 15 < mouseY && mouseY < 35) {
    if (!inside) {
      fill(colors[idx])
      idx = (idx + 1) % colors.length
      inside = true
    }
  } else {
    fill("#888")
    inside = false
  }
  circle(25, 25, 15)
}
