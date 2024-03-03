export class FiniteAutomaton {
  constructor() {
    this.states = ["q0", "q1", "q2", "q3"];
    this.alphabet = ["a", "b"];
    this.transitions = [
      { src: "q0", char: "a", dest: "q1" },
      { src: "q0", char: "a", dest: "q2" },
      { src: "q1", char: "b", dest: "q1" },
      { src: "q1", char: "a", dest: "q2" },
      { src: "q2", char: "a", dest: "q1" },
      { src: "q2", char: "b", dest: "q3" },
    ];
    this.start_state = "q0";
    this.accept_state = "q3";
  }

  to_regular_grammar() {
    let grammar = {
      terminals: [],
      non_terminals: [],
      rules: [],
      start: "",
    };

    this.alphabet.forEach((char) => {
      grammar.terminals.push(char);
    });

    this.states.forEach((state) => {
      grammar.non_terminals.push(state);
    });

    this.transitions.forEach((state) => {
      grammar.rules.push(state.src + "-" + state.char + "->" + state.dest);
    });

    grammar.start = this.start_state;

    return grammar;
  }
}
