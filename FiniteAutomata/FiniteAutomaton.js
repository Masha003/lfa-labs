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
      grammar.rules.push(`${state.src}-${state.char}->${state.dest}`);
    });

    grammar.start = this.start_state;

    return grammar;
  }

  is_deterministic() {
    const transitionMap = {};

    for (let { src, char, dest } of this.transitions) {
      if (!transitionMap[src]) {
        transitionMap[src] = {};
      }

      if (!transitionMap[src][char]) {
        transitionMap[src][char] = new Set();
      }
      transitionMap[src][char].add(dest);

      if (transitionMap[src][char].size > 1) {
        return false;
      }
    }
    return true;
  }

  to_dfa() {
    const dfa = {
      states: [],
      alphabet: [...this.alphabet],
      transitions: [],
      start_state: [this.start_state],
      accept_states: [],
    };

    const stateMap = {};

    const queue = [[...dfa.start_state].sort()];

    stateMap[queue[0].join(",")] = queue[0].join(",");

    while (queue.length > 0) {
      const currentState = queue.shift();
      const currentStateId = currentState.join(",");

      if (!dfa.states.includes(currentStateId)) {
        dfa.states.push(currentStateId);
      }

      if (
        currentState.some((state) => this.accept_state === state) &&
        !dfa.accept_states.includes(currentStateId)
      ) {
        dfa.accept_states.push(currentStateId);
      }

      this.alphabet.forEach((char) => {
        const nextState = new Set();

        currentState.forEach((state) => {
          this.transitions.forEach((transition) => {
            if (transition.src === state && transition.char === char) {
              nextState.add(transition.dest);
            }
          });
        });

        const nextStateArray = Array.from(nextState).sort();
        const nextStateId = nextStateArray.join(",");

        if (nextState.size > 0) {
          if (!stateMap[nextStateId]) {
            stateMap[nextStateId] = nextStateId;
            queue.push(nextStateArray);
          }

          dfa.transitions.push({
            src: currentStateId,
            char: char,
            dest: nextStateId,
          });
        }
      });
    }

    return dfa;
  }
}
