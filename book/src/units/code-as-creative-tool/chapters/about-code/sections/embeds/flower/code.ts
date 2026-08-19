import { drawFlower } from "@/lib/flower"

function setup() {
  createCanvas(50, 50)
}

function draw() {
  background("black")
  drawFlower({ numPetals: 9, petalWidth: 5, petalLength: 12 })
}
