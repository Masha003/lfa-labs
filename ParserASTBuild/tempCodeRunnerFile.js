
const parser = new Parser(tokens);
const ast = parser.parseExpression();

// console.log(JSON.stringify(ast, null, 2));
console.log(ast);