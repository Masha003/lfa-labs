from Grammar import Grammar


grammar = Grammar()
fa = grammar.to_finite_automaton()

test_strings = ['jaeed', 'afje']

for _ in range(5):
    test_strings.append(grammar.generate_string())

print(f"Generated strings: {test_strings}")
for s in test_strings:
    print(f"String '{s}' is accepted: {fa.accept(s)}")
