import Lexer from "./Lexer.js";

const input1 = "12 + 24 - 8";
const input2 = "12 + (variableName - 34) * 56 / variable_2";
const input3 = "if (x > 10) { function doSomething() { return x; } }";
const input4 = `function addArray(arr, n) {
    let sum = 0;
    for(int i = 0; i < n; i++) {
        sum += arr[i];
    }
    return sum;
}`;
const lexer = new Lexer(input4);
const tokens = lexer.tokenize();

console.log(tokens);
