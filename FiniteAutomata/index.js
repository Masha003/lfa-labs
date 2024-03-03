import { FiniteAutomaton } from "./FiniteAutomaton.js";
import { Grammar } from "./Grammar.js";

const fa = new FiniteAutomaton();
console.log(fa.to_regular_grammar());
