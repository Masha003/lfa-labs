import random
import FiniteAutomaton


class Grammar:
    def __init__(self):
        self.V_n = {'S', 'L', 'D'}
        self.V_t = {'a', 'b', 'c', 'd', 'e', 'f', 'j'}
        self.P = {
            'S': [['a', 'S'], ['b', 'S'], ['c', 'D'], ['d', 'L'], ['e']],
            'L': [['e', 'L'], ['f', 'L'], ['j', 'D'], ['e']],
            'D': [['e', 'D'], ['d']]
        }
        self.S = 'S'

    def generate_string(self):
        def expand(symbol):
            if symbol in self.V_t:
                return symbol
            productions = self.P[symbol]
            chosen_production = random.choice(productions)
            return ''.join(expand(sym) for sym in chosen_production)
        return expand(self.S)

    def to_finite_automaton(self):
        fa = FiniteAutomaton.FiniteAutomaton(set(self.V_n) | {'end'}, self.V_t, {}, self.S, {'end'})

        for non_terminal, productions in self.P.items():
            for production in productions:
                if len(production) == 2:
                    input_char, next_state = production
                    fa.transitions[(non_terminal, input_char)] = {next_state}
                elif len(production) == 1:
                    input_char = production[0]
                    if input_char in self.V_t:
                        fa.transitions[(non_terminal, input_char)] = {'end'}
                    else:
                        fa.transitions[(non_terminal, '')] = {input_char}

        return fa
