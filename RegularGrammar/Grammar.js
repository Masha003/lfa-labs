import { FiniteAutomaton } from "./FiniteAutomaton.js";

export class Grammar {
  constructor() {
    this.terminals = ["a", "b", "c", "d", "e", "f", "j"];
    this.non_terminals = ["S", "L", "D"];
    this.rules = [
      "S-aS",
      "S-bS",
      "S-cD",
      "S-dL",
      "S-e",
      "L-eL",
      "L-fL",
      "L-jD",
      "L-e",
      "D-eD",
      "D-d",
    ];
    this.start = "S";
  }

  generate_string() {
    const expand = (symbol) => {
      if (this.terminals.includes(symbol)) {
        return symbol;
      }
      const productions = this.rules
        .filter((rule) => rule.startsWith(symbol + "-"))
        .map((rule) => rule.split("-")[1]);
      const chosen_production =
        productions[Math.floor(Math.random() * productions.length)];
      return chosen_production
        .split("")
        .map((s) => expand(s))
        .join("");
    };

    return expand(this.start);
  }

  to_finite_automaton() {
    const alphabet = [...this.terminals];
    const states = [...this.terminals, "end"];
    const start_state = this.start;
    const accept_state = "end";

    const transitions = [];

    this.rules.forEach((rule) => {
      const parts = rule.split("-");
      const leftSide = parts[0];
      const rightSide = parts[1];

      if (rightSide.length === 1 && this.terminals.includes(rightSide)) {
        transitions.push({
          src: leftSide,
          char: rightSide,
          dest: accept_state,
        });
      } else if (rightSide.length > 1) {
        transitions.push({
          src: leftSide,
          char: rightSide[0],
          dest: rightSide[1],
        });
      }
    });

    return new FiniteAutomaton(
      states,
      alphabet,
      transitions,
      start_state,
      accept_state
    );
  }
}

// export default Grammar;
