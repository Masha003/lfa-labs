grammar.eliminateEpsilon();
console.log("After elimination:");
console.log(grammar.productions);

grammar.removeUnitProductions();
console.log("After unit prod elimination");
console.log(grammar.productions);

grammar.removeInaccessibleSymbols();
console.log("After inaccessible symbols elimination");
console.log(grammar.productions);

grammar.removeNonProductiveSymbols();
console.log("After non productive symbols elim");
console.log(grammar.productions);
