import { FiniteAutomaton } from "./FiniteAutomaton.js";

const fa = new FiniteAutomaton();
console.log("Convert to regular grammar: ", fa.to_regular_grammar());
console.log("Is FA deterministic? ", fa.is_deterministic());
console.log("DFA: ", fa.to_dfa());
