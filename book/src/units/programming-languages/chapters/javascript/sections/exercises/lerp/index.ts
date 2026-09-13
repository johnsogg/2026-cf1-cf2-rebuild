import starterCode from "./starter.js?raw"
import testCode from "./tests.js?raw"

const exercise = {
  id: "lerp-fn",
  title: "lerp",
  description:
    "Write your own version of map(), called lerp. Given a value v somewhere in a source range, return the equivalent value in a target range.",
  moduleName: "./solution",
  starterCode,
  testCode,
  hints: [
    "First find how far v is into the source range, as a fraction: scale = (v - source_low) / (source_high - source_low).",
    "Then apply that same fraction to the target range: target_low + scale * (target_high - target_low).",
  ],
}

export default exercise
