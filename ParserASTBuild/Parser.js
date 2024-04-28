import { BinaryOperatorNode, NumberNode, VariableNode } from "./ASTNode.js";
import { TokenType } from "./Lexer.js";

// export default class Parser {
//   constructor(tokens) {
//     this.tokens = tokens;
//     this.currentTokenIndex = 0;
//   }

//   consume() {
//     return this.tokens[this.currentTokenIndex++];
//   }

//   parseExpression() {
//     return this.parseAddition();
//   }

//   //   parseAddition() {
//   //     let left = this.parseMultiplication();

//   //     while (
//   //       this.currentTokenIndex < this.tokens.length &&
//   //       (this.tokens[this.currentTokenIndex].value === "+" ||
//   //         this.tokens[this.currentTokenIndex].value === "-")
//   //     ) {
//   //       const operator = this.consume().value;
//   //       const right = this.parseMultiplication();
//   //       left = new BinaryOperatorNode(operator, left, right);
//   //     }

//   //     return left;
//   //   }

//   parseAddition() {
//     let node = this.parseMultiplication();
//     while (this.peek().value === "+" || this.peek().value === "-") {
//       const operator = this.consume().value;
//       const right = this.parseMultiplication();
//       node = new BinaryOperatorNode(operator, node, right);
//     }
//     return node;
//   }

//   //   parseMultiplication() {
//   //     let left = this.parsePrimary();

//   //     while (
//   //       this.currentTokenIndex < this.tokens.length &&
//   //       (this.tokens[this.currentTokenIndex].value === "*" ||
//   //         this.tokens[this.currentTokenIndex].value === "/")
//   //     ) {
//   //       const operator = this.consume().value;
//   //       const right = this.parsePrimary();
//   //       left = new BinaryOperatorNode(operator, left, right);
//   //     }

//   //     return left;
//   //   }

//   parseMultiplication() {
//     let node = this.parsePrimary();
//     while (this.peek().value === "*" || this.peek().value === "/") {
//       const operator = this.consume().value;
//       const right = this.parsePrimary();
//       node = new BinaryOperatorNode(operator, node, right);
//     }
//     return node;
//   }

//   //   parsePrimary() {
//   //     const token = this.consume();
//   //     switch (token.type) {
//   //       case TokenType.INTEGER:
//   //         return new NumberNode(token.value);
//   //       case TokenType.IDENTIFIER:
//   //         return new VariableNode(token.value);
//   //       case TokenType.SEPARATOR:
//   //         if (token.value === "(") {
//   //           const expr = this.parseExpression(); // Parse the expression inside the parentheses
//   //           const nextToken = this.consume();
//   //           if (nextToken.value !== ")") {
//   //             throw new Error("Expected ')' after expression");
//   //           }
//   //           return expr; // Return the parsed expression node
//   //         }
//   //         break; // Add more cases if other separators need to be handled
//   //     }
//   //     throw new Error(`Unexpected token type: ${token.type}`);
//   //   }

//   parsePrimary() {
//     // Handle numbers, variables, and parentheses
//     const token = this.consume();
//     if (token.value === "(") {
//       const expr = this.parseExpression();
//       if (this.consume().value !== ")") {
//         throw new Error("Expected ')'");
//       }
//       return expr;
//     } else if (token.type === TokenType.NUMBER) {
//       return new NumberNode(token.value);
//     } else if (token.type === TokenType.IDENTIFIER) {
//       return new VariableNode(token.identifier);
//     }
//   }
// }

export default class Parser {
  constructor(tokens) {
    this.tokens = tokens;
    this.currentTokenIndex = 0;
  }

  consume() {
    return this.tokens[this.currentTokenIndex++];
  }

  // Peek at the next token without consuming it
  peek() {
    if (this.currentTokenIndex < this.tokens.length) {
      return this.tokens[this.currentTokenIndex];
    } else {
      return { type: TokenType.EOF, value: "" }; // Returns a default EOF token if no more tokens are available
    }
  }

  parseExpression() {
    return this.parseAddition();
  }

  parseAddition() {
    let node = this.parseMultiplication();
    while (this.peek().value === "+" || this.peek().value === "-") {
      const operator = this.consume().value;
      const right = this.parseMultiplication();
      node = new BinaryOperatorNode(operator, node, right);
    }
    return node;
  }

  parseMultiplication() {
    let node = this.parsePrimary();
    while (this.peek().value === "*" || this.peek().value === "/") {
      const operator = this.consume().value;
      const right = this.parsePrimary();
      node = new BinaryOperatorNode(operator, node, right);
    }
    return node;
  }

  parsePrimary() {
    const token = this.consume();
    if (token.type === TokenType.SEPARATOR && token.value === "(") {
      const expr = this.parseExpression();
      const expectedCloseParen = this.consume();
      if (
        expectedCloseParen.type !== TokenType.SEPARATOR ||
        expectedCloseParen.value !== ")"
      ) {
        throw new Error("Expected ')'");
      }
      return expr;
    } else if (token.type === TokenType.INTEGER) {
      return new NumberNode(token.value);
    } else if (token.type === TokenType.IDENTIFIER) {
      return new VariableNode(token.value);
    } else {
      throw new Error(`Unexpected token type: ${token.type}`);
    }
  }
}
