const transformOrderQuestion = {
  id: "geometry-transform-order",
  title: "Transform order",
  prompt:
    "drawShip() draws a ship around its own (0, 0). Which of these draws the ship centered at (0, 100) on the canvas?",
  options: [
    { text: "translate(100, 0); rotate(HALF_PI); drawShip()" },
    { text: "rotate(HALF_PI); translate(100, 0); drawShip()" },
    { text: "Both of them" },
    { text: "Neither of them" },
  ],
  correct: 1,
  hints: [
    "Each transform changes the coordinate system that the next one works in.",
    "rotate(HALF_PI) turns the x axis to point down the canvas. A translate after that moves along the new x axis.",
  ],
}

export default transformOrderQuestion
