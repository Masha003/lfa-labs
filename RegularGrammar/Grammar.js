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
  // constructor() {
  //   this.terminals = ["a", "b", "$"]; // `$` as a placeholder for ε
  //   this.non_terminals = ["S", "A", "B"];
  //   this.rules = [
  //     "S-aAB",
  //     "A-aAB",
  //     "A-$", // Placeholder for ε transition
  //     "B-bbB",
  //     "B-$", // Placeholder for ε transition
  //   ];
  //   this.start = "S";
  // }
  // constructor() {
  //   this.terminals = ["a", "b", "c"];
  //   this.non_terminals = ["S", "A", "B", "C"];
  //   this.rules = [
  //     "S-aBC",
  //     "CB-BC",
  //     "aB-Ba",
  //     "bB-Bb",
  //     "bC-Cc",
  //     "Bb-bB",
  //     "Cc-cC",
  //     "B-$", // Placeholder for ε transition, allowed in context-sensitive grammars under certain conditions
  //     "C-$", // Placeholder for ε transition
  //   ];
  //   this.start = "S";
  // }
  // constructor() {
  //   this.terminals = ["a", "b", "c"];
  //   this.non_terminals = ["S", "X", "Y", "Z"];
  //   this.rules = [
  //     // Production starts with S and recursively expands
  //     "S-XYZ",
  //     // X productions
  //     "X-aX", // X can produce an 'a' followed by X
  //     "X-a", // X can eventually terminate with an 'a'
  //     // Y productions
  //     "Y-bY", // Y can produce a 'b' followed by Y
  //     "Y-b", // Y can eventually terminate with a 'b'
  //     // Z productions with a context-sensitive rule
  //     "Z-cZ", // Z can produce a 'c' followed by Z
  //     "Z-c", // Z can eventually terminate with a 'c'
  //     // Example of a rule that would typically not be found in less powerful grammars:
  //     // This rule is non-context-free since it changes based on context (involves transformation of one form to another)
  //     "aXb-Y", // Replacing 'aXb' with 'Y', an example of a context-sensitive transformation
  //   ];
  //   this.start = "S";
  // }

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

  classify() {
    let isType3 = true; // Regular
    let isType2 = true; // Context-Free
    let isType1 = true; // Context-Sensitive

    this.rules.forEach((rule) => {
      const [leftSide, rightSide] = rule.split("-");
      const rightSideSymbols = rightSide.split("");
      const terminalSymbols = rightSideSymbols.filter((symbol) =>
        this.terminals.includes(symbol)
      );
      const nonTerminalSymbols = rightSideSymbols.filter((symbol) =>
        this.non_terminals.includes(symbol)
      );

      // Check for Type 3 (Regular) restrictions
      if (
        !(
          (
            (terminalSymbols.length === 1 && nonTerminalSymbols.length <= 1) || // A -> aB or A -> a
            rightSide === "$"
          ) // A -> ε (assuming '$' represents the empty string)
        )
      ) {
        isType3 = false;
      }

      // Check for Type 2 (Context-Free) restrictions
      if (
        leftSide.length !== 1 ||
        this.non_terminals.indexOf(leftSide) === -1
      ) {
        isType2 = false;
      }

      // Check for Type 1 (Context-Sensitive) restrictions: |β| >= |α|
      // This simple implementation assumes all non-terminals and terminals have a "length" of 1.
      if (rightSide.length < leftSide.length) {
        isType1 = false;
      }
    });

    if (isType3) {
      return "Regular Grammar (Type 3)";
    } else if (isType2) {
      return "Context-Free Grammar (Type 2)";
    } else if (isType1) {
      return "Context-Sensitive Grammar (Type 1)";
    } else {
      return "Recursively Enumerable Grammar (Type 0)";
    }
  }
}

// export default Grammar;
