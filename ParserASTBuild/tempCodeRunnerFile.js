const input = "12 + (variableName - 34) * 56 / variable_2";

const lexer = new Lexer(input);
const tokens = lexer.tokenize();

console.log(tokens);

const parser = new Parser(tokens);
const ast = parser.parseExpression();

console.log(JSON.stringify(ast, null, 2));