export class Grammar {
  constructor(nonTerminals, terminals, productions) {
    this.nonTerminals = nonTerminals; // Array of non-terminal symbols
    this.terminals = terminals; // Array of terminal symbols
    this.productions = productions;
  }

  // Method to eliminate epsilon productions
  eliminateEpsilon() {
    let epsilonProducing = new Set();

    // First pass: Find all non-terminals that directly produce epsilon
    for (let nonTerminal of this.nonTerminals) {
      if (this.productions[nonTerminal].includes("ep")) {
        epsilonProducing.add(nonTerminal);
      }
    }

    let additions;
    do {
      additions = false;
      // Second pass: Find all non-terminals that produce epsilon indirectly
      for (let nonTerminal of this.nonTerminals) {
        for (let production of this.productions[nonTerminal]) {
          const symbols = production.split("");
          if (symbols.every((symbol) => epsilonProducing.has(symbol))) {
            if (!epsilonProducing.has(nonTerminal)) {
              epsilonProducing.add(nonTerminal);
              additions = true;
            }
          }
        }
      }
    } while (additions);

    // Third pass: Remove epsilon and update productions
    for (let nonTerminal of this.nonTerminals) {
      this.productions[nonTerminal] = this.productions[nonTerminal].filter(
        (p) => p !== "ep"
      );
      const newProductions = [];
      this.productions[nonTerminal].forEach((production) => {
        let variants = [""];
        production.split("").forEach((symbol) => {
          if (epsilonProducing.has(symbol)) {
            variants = variants.flatMap((v) => [v, v + symbol]);
          } else {
            variants = variants.map((v) => v + symbol);
          }
        });
        newProductions.push(...variants.filter((v) => v.length > 0));
      });
      this.productions[nonTerminal] = [...new Set(newProductions)];
    }
  }

  removeUnitProductions() {
    // Map each non-terminal to the set of non-terminals it can reach via unit productions
    let unitProductions = {};
    this.nonTerminals.forEach((nt) => {
      unitProductions[nt] = new Set();
      this.productions[nt].forEach((prod) => {
        if (prod.length === 1 && this.nonTerminals.includes(prod)) {
          unitProductions[nt].add(prod);
        }
      });
    });

    // Find the closure of the unit productions for each non-terminal
    let changed = true;
    while (changed) {
      changed = false;
      for (let nt of this.nonTerminals) {
        let currentSize = unitProductions[nt].size;
        Array.from(unitProductions[nt]).forEach((unit) => {
          unitProductions[unit].forEach((element) => {
            unitProductions[nt].add(element);
          });
        });
        if (unitProductions[nt].size !== currentSize) {
          changed = true;
        }
      }
    }

    // Replace unit productions with the productions of their reachable non-terminals
    this.nonTerminals.forEach((nt) => {
      let newProductions = this.productions[nt].filter(
        (prod) => !(prod.length === 1 && this.nonTerminals.includes(prod))
      );
      unitProductions[nt].forEach((unit) => {
        this.productions[unit].forEach((prod) => {
          if (!(prod.length === 1 && this.nonTerminals.includes(prod))) {
            newProductions.push(prod);
          }
        });
      });
      this.productions[nt] = [...new Set(newProductions)];
    });
  }

  removeInaccessibleSymbols() {
    const accessible = new Set();
    const workList = ["S"]; // Assuming 'S' is the start symbol

    while (workList.length > 0) {
      const current = workList.pop();
      if (!accessible.has(current)) {
        accessible.add(current);
        // Examine each production of the current non-terminal
        (this.productions[current] || []).forEach((production) => {
          // Add non-terminals found in the production to the work list if they aren't already marked as accessible
          production.split("").forEach((symbol) => {
            if (this.nonTerminals.includes(symbol) && !accessible.has(symbol)) {
              workList.push(symbol);
            }
          });
        });
      }
    }

    // Filter out all non-terminals that are not accessible
    this.nonTerminals = this.nonTerminals.filter((nt) => accessible.has(nt));
    // Rebuild the productions object to remove productions of inaccessible non-terminals
    const newProductions = {};
    this.nonTerminals.forEach((nt) => {
      newProductions[nt] = this.productions[nt];
    });
    this.productions = newProductions;
  }

  removeNonProductiveSymbols() {
    const productive = new Set();

    // Initial pass: Identify terminals and productions consisting only of terminals
    for (let nt of this.nonTerminals) {
      this.productions[nt].forEach((production) => {
        // Check if the production consists only of terminals
        if (
          production
            .split("")
            .every((symbol) => this.terminals.includes(symbol))
        ) {
          productive.add(nt);
        }
      });
    }

    let changed = true;
    while (changed) {
      changed = false;
      for (let nt of this.nonTerminals) {
        if (!productive.has(nt)) {
          // Check if all symbols in any production are productive
          for (let production of this.productions[nt]) {
            if (
              production
                .split("")
                .every(
                  (symbol) =>
                    this.terminals.includes(symbol) || productive.has(symbol)
                )
            ) {
              if (!productive.has(nt)) {
                productive.add(nt);
                changed = true;
                break; // Once found productive, no need to check further
              }
            }
          }
        }
      }
    }

    // Filter non-productive non-terminals
    this.nonTerminals = this.nonTerminals.filter((nt) => productive.has(nt));
    // Rebuild the productions to exclude those involving non-productive symbols
    let newProductions = {};
    this.nonTerminals.forEach((nt) => {
      newProductions[nt] = this.productions[nt].filter((prod) =>
        prod
          .split("")
          .every(
            (symbol) =>
              this.terminals.includes(symbol) || productive.has(symbol)
          )
      );
    });
    this.productions = newProductions;
  }

  convertToCNF() {
    this.eliminateEpsilon();
    this.removeUnitProductions();
    this.removeInaccessibleSymbols();
    this.removeNonProductiveSymbols();

    // Step 1: Introduce new non-terminals for terminals in productions with more than one symbol
    const terminalMap = {}; // Map each terminal to a new non-terminal
    let newNTCounter = this.nonTerminals.length;
    Object.keys(this.productions).forEach((nt) => {
      this.productions[nt] = this.productions[nt].map((production) => {
        const symbols = production.split("");
        if (symbols.length > 1) {
          return symbols
            .map((symbol) => {
              if (this.terminals.includes(symbol)) {
                if (!terminalMap[symbol]) {
                  const newNT = `Z${newNTCounter++}`;
                  terminalMap[symbol] = newNT;
                  this.nonTerminals.push(newNT);
                  this.productions[newNT] = [symbol]; // newNT -> symbol
                }
                return terminalMap[symbol];
              }
              return symbol;
            })
            .join("");
        }
        return production;
      });
    });

    // Step 2: Ensure all productions are in the correct form
    const newProductions = {};
    this.nonTerminals.forEach((nt) => (newProductions[nt] = []));

    Object.keys(this.productions).forEach((nt) => {
      this.productions[nt].forEach((production) => {
        const parts = production.split("");
        if (parts.length == 2) {
          newProductions[nt].push(production); // Already in CNF
        } else if (parts.length > 2) {
          // Convert to binary rules
          let currentNT = nt;
          while (parts.length > 2) {
            const first = parts.shift();
            const second = parts.shift();
            const newNT = `Z${newNTCounter++}`;
            this.nonTerminals.push(newNT);
            newProductions[newNT] = [first + second];
            parts.unshift(newNT);
            currentNT = newNT;
          }
          newProductions[nt].push(parts.join(""));
        } else {
          // Single terminal or non-terminal
          newProductions[nt].push(production);
        }
      });
    });

    // Replace old productions with new ones
    this.productions = newProductions;
  }
}
