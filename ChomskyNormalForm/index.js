// Example usage
import { Grammar } from "./Grammar.js";

const grammar = new Grammar(["S", "A", "B", "D", "C"], ["a", "b"], {
  S: ["aB", "bA", "A"],
  A: ["B", "AS", "bBAB", "b", "ep"],
  B: ["b", "bS", "aD", "ep"],
  D: ["AA"],
  C: ["Ba"],
});

console.log("Before elimination:");
console.log(grammar.productions);

grammar.eliminateEpsilon();
console.log("After elimination:");
console.log(grammar.productions);

grammar.removeUnitProductions();
console.log("After unit prod elimination");
console.log(grammar.productions);

grammar.removeInaccessibleSymbols();
console.log("After inaccessible symbols elimination");
console.log(grammar.productions);

grammar.removeNonProductiveSymbols();
console.log("After non productive symbols elim");
console.log(grammar.productions);

grammar.convertToCNF();
console.log("After CNF conversion:");
console.log(grammar.productions);
