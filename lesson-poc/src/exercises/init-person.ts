import type { CodeExerciseProps } from '../components/CodeExercise'

const initPerson: CodeExerciseProps = {
  type: 'code',
  id: 'init-person',
  title: 'initPerson and greet',
  description: `Implement the two functions below.
- initPerson should return a Person object with firstName and lastName set.
- greet should return "Hello, <firstName> <lastName>".`,
  moduleName: './solution',
  starterCode: `// Your implementation goes here.

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

test("initPerson creates a person with the right fields", () => {
  const xy = initPerson("X", "Y");
  expect(xy).not.toBeNull();
  expect(xy.firstName).toBe("X");
  expect(xy.lastName).toBe("Y");

  const theHeroOfTheStory = initPerson("Bob", "Barker");
  expect(theHeroOfTheStory.firstName).toBe("Bob");
  expect(theHeroOfTheStory.lastName).toBe("Barker");
});

test("greet returns a greeting string", () => {
  const greeting = greet("Tom", "Jones");
  expect(greeting).not.toBeNull();
  expect(greeting).toBe("Hello, Tom Jones");
});
`,
  hints: [
    'Return an object literal with firstName and lastName set from the arguments.',
    'Use initPerson to build the person, then return a template literal like `Hello, ${person.firstName} ${person.lastName}`.',
  ],
}

export default initPerson
