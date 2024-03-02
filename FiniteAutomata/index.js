import { Grammar } from "./Grammar.js";

const grammar = new Grammar();
// const fa = grammar.to_finite_automaton();

// let testStrings = ["jaeed", "afje"];

// for (let i = 0; i < 5; i++) {
//   testStrings.push(grammar.generate_string());
// }

// console.log(`Generated strings: ${testStrings}`);

// testStrings.forEach((s) => {
//   console.log(`String '${s}' is accepted: ${fa.accept(s)}`);
// });

console.log("classifyyyyyy: ", grammar.classify());
