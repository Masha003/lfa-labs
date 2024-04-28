export class ASTNode {
  constructor(type) {
    this.type = type;
  }
}

export class BinaryOperatorNode extends ASTNode {
  constructor(operator, left, right) {
    super("BinaryOperator");
    this.operator = operator;
    this.left = left;
    this.right = right;
  }
}

export class NumberNode extends ASTNode {
  constructor(value) {
    super("Number");
    this.value = parseInt(value, 10);
  }
}

export class VariableNode extends ASTNode {
  constructor(identifier) {
    super("Variable");
    this.identifier = identifier;
  }
}
