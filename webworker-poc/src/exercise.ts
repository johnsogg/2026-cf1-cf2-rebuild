export type Exercise = {
  title: string;
  description: string;
  studentCode: string;
  testCode: string;
};

export const infiniteLoopExercise: Exercise = {
  title: "Infinite Loop Test",
  description:
    "This exercise intentionally contains an infinite loop to test timeout behavior.",
  studentCode: `// This code will never finish
while (true) {
  // infinite loop
}
`,
  testCode: `
test("this will never run", () => {
  expect(true).toBe(true);
});
`,
};

export const sampleExercise: Exercise = {
  title: "initPerson and greet",
  description: `Implement the two functions below.
- initPerson should return a Person object with firstName and lastName set.
- greet should return "Hello, <firstName> <lastName>".`,

  studentCode: `// Your implementation goes here.

export type Person = {
  firstName: string;
  lastName: string;
};

export const initPerson = (first: string, last: string): Person => {
  // IMPLEMENT
  return null;
};

export const greet = (first: string, last: string): string => {
  const person = initPerson(first, last);
  return "this isn't implemented just yet";
};
`,

  testCode: `import { initPerson, greet } from "./solution";

test("initPerson function works", () => {
  const xy = initPerson("X", "Y");
  expect(xy).not.toBeNull();
  expect(xy.firstName).toBe("X");
  expect(xy.lastName).toBe("Y");

  const theHeroOfTheStory = initPerson("Bob", "Barker");
  expect(theHeroOfTheStory.firstName).toBe("Bob");
  expect(theHeroOfTheStory.lastName).toBe("Barker");
});

test("greet function works", () => {
  const greeting = greet("Tom", "Jones");
  expect(greeting).not.toBeNull();
  expect(greeting).toBe("Hello, Tom Jones");
});
`,
};
