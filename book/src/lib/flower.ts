import { Color } from "p5"

export function drawFlower({
  stem = color(21, 49, 9),
  disk = color(177, 152, 41),
  petal = color(117, 43, 65),
  numPetals = 10,
  petalLength = 9,
  petalWidth = 3,
}: {
  stem?: Color
  disk?: Color
  petal?: Color
  numPetals?: number
  petalLength?: number
  petalWidth?: number
}) {
  push()
  noStroke()

  // stem
  fill(stem)
  rect(23, 25, 4, 22)

  // petals with fancy footwork
  push()
  fill(petal)
  translate(25, 20)
  for (let i = 0; i < numPetals; i++) {
    rotate((PI * 2) / numPetals)
    ellipse(12, 0, petalLength, petalWidth)
  }
  pop()

  // disk (middle bit of the flower that the petals attach to)
  fill(disk)
  circle(25, 20, 16)
  pop()
}
