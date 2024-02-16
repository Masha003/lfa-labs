import random
import Grammar


grammar = Grammar.Grammar()
fa = grammar.to_finite_automaton()

test_strings = ['fed', 'jaaae']
print("Generated strings:")
for _ in range(5):
    test_strings.append(grammar.generate_string())

print(test_strings)

for s in test_strings:
    print(f"String '{s}' is accepted: {fa.accepts(s)}")

