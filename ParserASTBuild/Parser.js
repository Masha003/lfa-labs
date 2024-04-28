import { BinaryOperatorNode, NumberNode, VariableNode } from "./ASTNode.js";
import { TokenType } from "./Lexer.js";

export default class Parser {
  constructor(tokens) {
    this.tokens = tokens;
    this.currentTokenIndex = 0;
  }

  consume() {
    return this.tokens[this.currentTokenIndex++];
  }

  peek() {
    if (this.currentTokenIndex < this.tokens.length) {
      return this.tokens[this.currentTokenIndex];
    } else {
      return { type: TokenType.EOF, value: "" };
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
