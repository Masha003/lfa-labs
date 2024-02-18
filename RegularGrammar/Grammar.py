import random
from FiniteAutomaton import FiniteAutomaton


class Grammar:
    def __init__(self):
        self.V_t = ["a", "b", "c", "d", "e", "f", "j"]
        self.V_n = ["S", "L", "D"]
        self.P = ["S-aS", "S-bS", "S-cD", "S-dL",
                  "S-e", "L-eL", "L-fL", "L-jD", "L-e", "D-eD", "D-d"]
        self.S = "S"

    def generate_string(self):
        def expand(symbol):
            if symbol in self.V_t:
                return symbol
            productions = [p.split("-")[1] for p in self.P if p.startswith(symbol + "-")]
            chosen_production = random.choice(productions)
            return ''.join(expand(s) for s in chosen_production)

        return expand(self.S)

    def to_finite_automaton(self):
        alphabet = list(self.V_t)
        states = list(self.V_n)
        states.append("end")
        start_state = self.S
        accept_state = "end"

        transitions = []
        for production in self.P:
            parts = production.split("-")
            left_side = parts[0]
            right_side = parts[1]

            if len(right_side) == 1 and right_side in self.V_t:
                transitions.append({'src': left_side, 'char': right_side, 'dest': accept_state})
            elif len(right_side) > 1:
                transitions.append({'src': left_side, 'char': right_side[0], 'dest': right_side[1]})

        return FiniteAutomaton(states, alphabet, transitions, start_state, accept_state)
