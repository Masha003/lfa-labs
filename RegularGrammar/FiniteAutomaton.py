class FiniteAutomaton:
    def __init__(self):
        self.states = {'S', 'L', 'D', 'end'}
        self.alphabet = {'a', 'b', 'c', 'd', 'e', 'f', 'j'}
        self.transitions = {
            ('S', 'a'): {"S"},
            ('S', 'b'): {"S"},
            ('S', 'c'): {"D"},
            ('S', 'd'): {"L"},
            ('D', 'e'): {"D"},
            ('D', 'd'): {"end"},
            ('L', 'e'): {"L", "end"},
            ('L', 'f'): {"L"},
            ('L', 'j'): {"D"},
            ('S', 'e'): {"end"},
        }
        self.start_state = 'S'
        self.accept_states = {'end'}

    def accepts(self, input_string):
        current_states = {self.start_state}
        for char in input_string:
            next_states = set()
            for state in current_states:
                transition_key = (state, char)
                if transition_key in self.transitions:
                    next_states.update(self.transitions[transition_key])
            current_states = next_states

        return bool(current_states & self.accept_states)