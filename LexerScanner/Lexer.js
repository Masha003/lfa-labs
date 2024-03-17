class Token {
  constructor(type, value) {
    this.type = type;
    this.value = value;
  }
}

const KEYWORDS = {
  if: "IF",
  else: "ELSE",
  function: "FUNCTION",
  return: "RETURN",
  let: "LET",
};

const OPERATOR = {
  plus: "+",
  minus: "-",
  mult: "*",
  div: "/",
  mod: "%",
  less: "<",
  more: ">",
  equal: "==",
  assign: "=",
};

const SEPARATOR = {
  l_paren: "(",
  r_paren: ")",
  l_curly: "{",
  r_curly: "}",
  l_square: "[",
  r_square: "]",
  semicolon: ";",
  comma: ",",
};

class Lexer {
  constructor(input) {
    this.input = input;
    this.index = 0;
  }

  isAlpha(char) {
    return /[a-zA-Z_]/.test(char);
  }

  isDigit(char) {
    return /\d/.test(char);
  }

  isAlphanumeric(char) {
    return this.isAlpha(char) || this.isDigit(char);
  }

  nextToken() {
    while (this.index < this.input.length) {
      let currentChar = this.input[this.index];

      if (/\s/.test(currentChar)) {
        this.index++;
        continue;
      }

      if (this.isDigit(currentChar)) {
        let num = "";
        while (
          this.index < this.input.length &&
          this.isDigit(this.input[this.index])
        ) {
          num += this.input[this.index++];
        }
        return new Token("INTEGER", num);
      }

      if (this.isAlpha(currentChar)) {
        let ident = "";
        while (
          this.index < this.input.length &&
          this.isAlphanumeric(this.input[this.index])
        ) {
          ident += this.input[this.index++];
        }
        if (KEYWORDS.hasOwnProperty(ident)) {
          return new Token(KEYWORDS[ident], ident);
        }
        return new Token("IDENTIFIER", ident);
      }

      for (let [type, value] of Object.entries({ ...OPERATOR, ...SEPARATOR })) {
        if (currentChar.startsWith(value)) {
          this.index += value.length;
          return new Token(type.toUpperCase(), value);
        }
      }

      throw new Error(`Unknown token: ${currentChar}`);
    }

    return new Token("EOF", "");
  }

  tokenize() {
    const tokens = [];
    let nextToken = this.nextToken();
    while (nextToken.type !== "EOF") {
      tokens.push(nextToken);
      nextToken = this.nextToken();
    }
    return tokens;
  }
}

export default Lexer;
