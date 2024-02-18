class FiniteAutomaton:
    def __init__(self, states, alphabet, transitions, start_state, accept_states):
        self.states = states
        self.alphabet = alphabet
        self.transitions = transitions
        self.start_state = start_state
        self.accept_states = accept_states

    def accept(self, input_string):
        current_states = {self.start_state}
        for char in input_string:
            input_symbol = str(char)
            next_states = set()
            for current_state in current_states:
                transitions = self.find_transitions(current_state, input_symbol)
                for transition in transitions:
                    next_states.add(transition['dest'])
            if not next_states:
                return False
            current_states = next_states
        for current_state in current_states:
            if current_state in self.accept_states:
                return True

        return False

    def find_transitions(self, current_state, input_symbol):
        result = []
        for transition in self.transitions:
            if transition['src'] == current_state and transition['char'] == input_symbol:
                result.append(transition)
        return result
