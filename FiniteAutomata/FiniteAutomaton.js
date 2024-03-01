export class FiniteAutomaton {
  constructor(states, alphabet, transitions, start_state, accept_state) {
    this.states = states;
    this.alphabet = alphabet;
    this.transitions = transitions;
    this.start_state = start_state;
    this.accept_state = accept_state;
  }

  accept(inputString) {
    let currentStates = new Set([this.start_state]);

    for (let i = 0; i < inputString.length; i++) {
      const inputSymbol = inputString[i];
      let nextStates = new Set();

      currentStates.forEach((currentState) => {
        const transitions = this.find_transitions(currentState, inputSymbol);
        transitions.forEach((transition) => {
          nextStates.add(transition.dest);
        });
      });

      if (nextStates.size === 0) {
        return false;
      }

      currentStates = nextStates;
    }
    console.log(currentStates);
    for (let currState of currentStates) {
      if (this.accept_state.includes(currState)) {
        return true;
      }
    }

    return false;
  }

  find_transitions(currentState, inputSymbol) {
    return this.transitions.filter(
      (transition) =>
        transition.src === currentState && transition.char === inputSymbol
    );
  }
}

export default FiniteAutomaton;
