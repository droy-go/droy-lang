// Droy Language Lexer - Tokenizer

export const TokenType = {
  // Literals
  STRING: 'STRING',
  NUMBER: 'NUMBER',
  IDENTIFIER: 'IDENTIFIER',
  SPECIAL_VAR: 'SPECIAL_VAR', // @si, @ui, etc.

  // Keywords
  SET: 'SET',
  EM: 'EM',
  RET: 'RET',
  FE: 'FE', // if
  F: 'F',   // function
  FOR: 'FOR',
  STY: 'STY',
  LINK: 'LINK',
  TEXT: 'TEXT',
  TXT: 'TXT',
  PKG: 'PKG',
  MEDIA: 'MEDIA',

  // Shorthand keywords
  TILDE_S: 'TILDE_S', // ~s
  TILDE_E: 'TILDE_E', // ~e
  TILDE_R: 'TILDE_R', // ~r

  // Operators
  PLUS: 'PLUS',
  MINUS: 'MINUS',
  MULTIPLY: 'MULTIPLY',
  DIVIDE: 'DIVIDE',
  ASSIGN: 'ASSIGN',
  GT: 'GT',
  LT: 'LT',
  EQ: 'EQ',

  // Delimiters
  LPAREN: 'LPAREN',
  RPAREN: 'RPAREN',
  LBRACE: 'LBRACE',
  RBRACE: 'RBRACE',
  SEMICOLON: 'SEMICOLON',
  COLON: 'COLON',
  COMMA: 'COMMA',

  // Special
  COMMENT: 'COMMENT',
  NEWLINE: 'NEWLINE',
  EOF: 'EOF',
  UNKNOWN: 'UNKNOWN',
} as const;

export type TokenTypeValue = typeof TokenType[keyof typeof TokenType];

export interface Token {
  type: TokenTypeValue;
  value: string;
  line: number;
  column: number;
}

export class Lexer {
  private input: string;
  private position: number = 0;
  private line: number = 1;
  private column: number = 1;

  constructor(input: string) {
    this.input = input;
  }

  private peek(offset: number = 0): string {
    const pos = this.position + offset;
    return pos < this.input.length ? this.input[pos] : '\0';
  }

  private advance(): string {
    const char = this.peek();
    this.position++;
    if (char === '\n') {
      this.line++;
      this.column = 1;
    } else {
      this.column++;
    }
    return char;
  }

  private skipWhitespace(): void {
    while (this.peek() === ' ' || this.peek() === '\t' || this.peek() === '\r') {
      this.advance();
    }
  }

  private readString(quote: string): string {
    let result = '';
    this.advance(); // skip opening quote
    while (this.peek() !== quote && this.peek() !== '\0') {
      if (this.peek() === '\\') {
        this.advance();
        const escaped = this.advance();
        switch (escaped) {
          case 'n': result += '\n'; break;
          case 't': result += '\t'; break;
          case '\\': result += '\\'; break;
          case '"': result += '"'; break;
          case "'": result += "'"; break;
          default: result += escaped;
        }
      } else {
        result += this.advance();
      }
    }
    this.advance(); // skip closing quote
    return result;
  }

  private readNumber(): string {
    let result = '';
    while (/[0-9.]/.test(this.peek())) {
      result += this.advance();
    }
    return result;
  }

  private readIdentifier(): string {
    let result = '';
    while (/[a-zA-Z0-9_]/.test(this.peek()) || this.peek() === '-') {
      result += this.advance();
    }
    return result;
  }

  private readSpecialVar(): string {
    let result = this.advance(); // @
    while (/[a-zA-Z0-9_]/.test(this.peek())) {
      result += this.advance();
    }
    return result;
  }

  private readComment(): string {
    let result = '';
    this.advance(); // skip first /
    this.advance(); // skip second /
    while (this.peek() !== '\n' && this.peek() !== '\0') {
      result += this.advance();
    }
    return result;
  }

  private readCommand(): string {
    let result = this.advance(); // *
    while (/[a-zA-Z0-9_/]/.test(this.peek())) {
      result += this.advance();
    }
    return result;
  }

  public nextToken(): Token {
    this.skipWhitespace();

    const char = this.peek();
    const line = this.line;
    const column = this.column;

    if (char === '\0') {
      return { type: TokenType.EOF, value: '', line, column };
    }

    // Newlines
    if (char === '\n') {
      this.advance();
      return { type: TokenType.NEWLINE, value: '\n', line, column };
    }

    // Comments
    if (char === '/' && this.peek(1) === '/') {
      const comment = this.readComment();
      return { type: TokenType.COMMENT, value: comment, line, column };
    }

    // Strings
    if (char === '"' || char === "'") {
      const str = this.readString(char);
      return { type: TokenType.STRING, value: str, line, column };
    }

    // Numbers
    if (/[0-9]/.test(char)) {
      const num = this.readNumber();
      return { type: TokenType.NUMBER, value: num, line, column };
    }

    // Special variables (@si, @ui, etc.)
    if (char === '@') {
      const varName = this.readSpecialVar();
      return { type: TokenType.SPECIAL_VAR, value: varName, line, column };
    }

    // Commands (*/employment, etc.)
    if (char === '*' && this.peek(1) === '/') {
      const cmd = this.readCommand();
      return { type: TokenType.IDENTIFIER, value: cmd, line, column };
    }

    // Identifiers and keywords
    if (/[a-zA-Z_]/.test(char)) {
      const id = this.readIdentifier();
      const tokenType = this.getKeywordType(id);
      return { type: tokenType, value: id, line, column };
    }

    // Shorthand operators (~s, ~e, ~r)
    if (char === '~') {
      this.advance();
      const next = this.peek();
      if (next === 's' || next === 'S') {
        this.advance();
        return { type: TokenType.TILDE_S, value: '~s', line, column };
      }
      if (next === 'e' || next === 'E') {
        this.advance();
        return { type: TokenType.TILDE_E, value: '~e', line, column };
      }
      if (next === 'r' || next === 'R') {
        this.advance();
        return { type: TokenType.TILDE_R, value: '~r', line, column };
      }
      return { type: TokenType.UNKNOWN, value: '~' + next, line, column };
    }

    // Single character tokens
    this.advance();
    switch (char) {
      case '+': return { type: TokenType.PLUS, value: '+', line, column };
      case '-': return { type: TokenType.MINUS, value: '-', line, column };
      case '*': return { type: TokenType.MULTIPLY, value: '*', line, column };
      case '/': return { type: TokenType.DIVIDE, value: '/', line, column };
      case '=':
        if (this.peek() === '=') {
          this.advance();
          return { type: TokenType.EQ, value: '==', line, column };
        }
        return { type: TokenType.ASSIGN, value: '=', line, column };
      case '>': return { type: TokenType.GT, value: '>', line, column };
      case '<': return { type: TokenType.LT, value: '<', line, column };
      case '(': return { type: TokenType.LPAREN, value: '(', line, column };
      case ')': return { type: TokenType.RPAREN, value: ')', line, column };
      case '{': return { type: TokenType.LBRACE, value: '{', line, column };
      case '}': return { type: TokenType.RBRACE, value: '}', line, column };
      case ';': return { type: TokenType.SEMICOLON, value: ';', line, column };
      case ':': return { type: TokenType.COLON, value: ':', line, column };
      case ',': return { type: TokenType.COMMA, value: ',', line, column };
      default: return { type: TokenType.UNKNOWN, value: char, line, column };
    }
  }

  private getKeywordType(id: string): TokenTypeValue {
    const keywords: Record<string, TokenTypeValue> = {
      'set': TokenType.SET,
      'em': TokenType.EM,
      'ret': TokenType.RET,
      'fe': TokenType.FE,
      'f': TokenType.F,
      'for': TokenType.FOR,
      'sty': TokenType.STY,
      'link': TokenType.LINK,
      'text': TokenType.TEXT,
      'txt': TokenType.TXT,
      'pkg': TokenType.PKG,
      'media': TokenType.MEDIA,
    };
    return keywords[id.toLowerCase()] || TokenType.IDENTIFIER;
  }

  public tokenize(): Token[] {
    const tokens: Token[] = [];
    let token = this.nextToken();
    while (token.type !== TokenType.EOF) {
      tokens.push(token);
      token = this.nextToken();
    }
    tokens.push(token); // EOF
    return tokens;
  }
}

export default Lexer;
