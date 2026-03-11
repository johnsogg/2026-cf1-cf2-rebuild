import P5Exercise from "./components/P5Exercise"

const starterSketch = `function setup() {
  createCanvas(400, 400);
}

function draw() {
  background(220);
  fill(255, 100, 0);
  ellipse(mouseX, mouseY, 50, 50);
}
`

export default function App() {
  return (
    <div style={{ padding: "2rem", fontFamily: "sans-serif" }}>
      <h1>p5.js Exercise POC</h1>
      <p>Write a p5 sketch using global mode. Click Run to execute it.</p>
      <P5Exercise initialCode={starterSketch} />
    </div>
  )
}
