// Droy Language Compiler - TypeScript Implementation
// Supports simplified syntax with new string formats:
// ~s=p*hello  (pointer-style strings)
// ~s=txt="hi" (variable-style strings)

export type TokenType = 
  | 'SET' | 'GET' | 'VAR' | 'FUNC' | 'RETURN' | 'IF' | 'ELSE' | 'FOR' | 'WHILE'
  | 'PRINT' | 'INPUT' | 'LINK' | 'ARRAY' | 'CLASS' | 'IMPORT' | 'EXPORT'
  | 'NUMBER' | 'STRING' | 'BOOLEAN' | 'NULL' | 'IDENTIFIER'
  | 'PLUS' | 'MINUS' | 'MULTIPLY' | 'DIVIDE' | 'MODULO'
  | 'ASSIGN' | 'EQ' | 'NEQ' | 'LT' | 'GT' | 'LTE' | 'GTE'
  | 'AND' | 'OR' | 'NOT'
  | 'LPAREN' | 'RPAREN' | 'LBRACE' | 'RBRACE' | 'LBRACKET' | 'RBRACKET'
  | 'COMMA' | 'COLON' | 'SEMICOLON' | 'DOT' | 'ARROW'
  | 'COMMENT' | 'NEWLINE' | 'EOF' | 'POINTER' | 'TILDE';

export interface Token {
  type: TokenType;
  value: string;
  line: number;
  column: number;
}

export interface ASTNode {
  type: string;
  [key: string]: any;
}

// Lexer: Converts source code into tokens
export class DroyLexer {
  private source: string;
  private position: number = 0;
  private line: number = 1;
  private column: number = 1;
  private tokens: Token[] = [];

  // Keywords mapping
  private keywords: Map<string, TokenType> = new Map([
    ['set', 'SET'],
    ['get', 'GET'],
    ['var', 'VAR'],
    ['func', 'FUNC'],
    ['return', 'RETURN'],
    ['if', 'IF'],
    ['else', 'ELSE'],
    ['for', 'FOR'],
    ['while', 'WHILE'],
    ['print', 'PRINT'],
    ['input', 'INPUT'],
    ['link', 'LINK'],
    ['array', 'ARRAY'],
    ['class', 'CLASS'],
    ['import', 'IMPORT'],
    ['export', 'EXPORT'],
    ['true', 'BOOLEAN'],
    ['false', 'BOOLEAN'],
    ['null', 'NULL'],
  ]);

  constructor(source: string) {
    this.source = source;
  }

  private peek(offset: number = 0): string {
    const pos = this.position + offset;
    return pos < this.source.length ? this.source[pos] : '\0';
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
    while (/\s/.test(this.peek()) && this.peek() !== '\n') {
      this.advance();
    }
  }

  private readString(quote: string): string {
    let value = '';
    this.advance(); // skip opening quote
    while (this.peek() !== quote && this.peek() !== '\0') {
      if (this.peek() === '\\') {
        this.advance();
        const escaped = this.advance();
        switch (escaped) {
          case 'n': value += '\n'; break;
          case 't': value += '\t'; break;
          case 'r': value += '\r'; break;
          case '\\': value += '\\'; break;
          case '"': value += '"'; break;
          case "'": value += "'"; break;
          default: value += escaped;
        }
      } else {
        value += this.advance();
      }
    }
    this.advance(); // skip closing quote
    return value;
  }

  private readNumber(): string {
    let value = '';
    while (/[0-9.]/.test(this.peek())) {
      value += this.advance();
    }
    return value;
  }

  private readIdentifier(): string {
    let value = '';
    while (/[a-zA-Z0-9_]/.test(this.peek())) {
      value += this.advance();
    }
    return value;
  }

  private readComment(): string {
    let value = '';
    while (this.peek() !== '\n' && this.peek() !== '\0') {
      value += this.advance();
    }
    return value;
  }

  private addToken(type: TokenType, value: string): void {
    this.tokens.push({
      type,
      value,
      line: this.line,
      column: this.column - value.length,
    });
  }

  public tokenize(): Token[] {
    while (this.position < this.source.length) {
      const char = this.peek();

      // New syntax: ~s=p*hello (pointer-style string)
      if (char === '~') {
        this.advance();
        const next = this.peek();
        if (next === 's') {
          this.advance();
          this.addToken('SET', '~s');
          continue;
        } else if (next === 'g') {
          this.advance();
          this.addToken('GET', '~g');
          continue;
        }
        this.addToken('TILDE', '~');
        continue;
      }

      // Pointer-style string: p*hello
      if (char === 'p' && this.peek(1) === '*') {
        this.advance(); // p
        this.advance(); // *
        let value = '';
        while (this.peek() !== '\n' && this.peek() !== '\0' && this.peek() !== ' ') {
          value += this.advance();
        }
        this.addToken('POINTER', value);
        continue;
      }

      // Skip whitespace
      if (/\s/.test(char) && char !== '\n') {
        this.skipWhitespace();
        continue;
      }

      // Newlines
      if (char === '\n') {
        this.addToken('NEWLINE', '\n');
        this.advance();
        continue;
      }

      // Comments
      if (char === '#') {
        this.readComment();
        continue;
      }

      // Strings
      if (char === '"' || char === "'") {
        const value = this.readString(char);
        this.addToken('STRING', value);
        continue;
      }

      // Numbers
      if (/[0-9]/.test(char)) {
        const value = this.readNumber();
        this.addToken('NUMBER', value);
        continue;
      }

      // Identifiers and keywords
      if (/[a-zA-Z_]/.test(char)) {
        const value = this.readIdentifier();
        const type = this.keywords.get(value) || 'IDENTIFIER';
        this.addToken(type, value);
        continue;
      }

      // Operators and punctuation
      switch (char) {
        case '+':
          this.advance();
          if (this.peek() === '=') {
            this.advance();
            this.addToken('ASSIGN', '+=');
          } else {
            this.addToken('PLUS', '+');
          }
          break;
        case '-':
          this.advance();
          if (this.peek() === '>') {
            this.advance();
            this.addToken('ARROW', '->');
          } else if (this.peek() === '=') {
            this.advance();
            this.addToken('ASSIGN', '-=');
          } else {
            this.addToken('MINUS', '-');
          }
          break;
        case '*':
          this.advance();
          if (this.peek() === '=') {
            this.advance();
            this.addToken('ASSIGN', '*=');
          } else {
            this.addToken('MULTIPLY', '*');
          }
          break;
        case '/':
          this.advance();
          if (this.peek() === '=') {
            this.advance();
            this.addToken('ASSIGN', '/=');
          } else {
            this.addToken('DIVIDE', '/');
          }
          break;
        case '%':
          this.advance();
          this.addToken('MODULO', '%');
          break;
        case '=':
          this.advance();
          if (this.peek() === '=') {
            this.advance();
            this.addToken('EQ', '==');
          } else {
            this.addToken('ASSIGN', '=');
          }
          break;
        case '!':
          this.advance();
          if (this.peek() === '=') {
            this.advance();
            this.addToken('NEQ', '!=');
          } else {
            this.addToken('NOT', '!');
          }
          break;
        case '<':
          this.advance();
          if (this.peek() === '=') {
            this.advance();
            this.addToken('LTE', '<=');
          } else {
            this.addToken('LT', '<');
          }
          break;
        case '>':
          this.advance();
          if (this.peek() === '=') {
            this.advance();
            this.addToken('GTE', '>=');
          } else {
            this.addToken('GT', '>');
          }
          break;
        case '&':
          this.advance();
          if (this.peek() === '&') {
            this.advance();
            this.addToken('AND', '&&');
          }
          break;
        case '|':
          this.advance();
          if (this.peek() === '|') {
            this.advance();
            this.addToken('OR', '||');
          }
          break;
        case '(':
          this.advance();
          this.addToken('LPAREN', '(');
          break;
        case ')':
          this.advance();
          this.addToken('RPAREN', ')');
          break;
        case '{':
          this.advance();
          this.addToken('LBRACE', '{');
          break;
        case '}':
          this.advance();
          this.addToken('RBRACE', '}');
          break;
        case '[':
          this.advance();
          this.addToken('LBRACKET', '[');
          break;
        case ']':
          this.advance();
          this.addToken('RBRACKET', ']');
          break;
        case ',':
          this.advance();
          this.addToken('COMMA', ',');
          break;
        case ':':
          this.advance();
          this.addToken('COLON', ':');
          break;
        case ';':
          this.advance();
          this.addToken('SEMICOLON', ';');
          break;
        case '.':
          this.advance();
          this.addToken('DOT', '.');
          break;
        default:
          // Unknown character, skip it
          this.advance();
      }
    }

    this.addToken('EOF', '');
    return this.tokens;
  }
}

// Parser: Converts tokens into AST
export class DroyParser {
  private tokens: Token[];
  private position: number = 0;

  constructor(tokens: Token[]) {
    this.tokens = tokens;
  }

  private peek(offset: number = 0): Token {
    const pos = this.position + offset;
    return pos < this.tokens.length ? this.tokens[pos] : this.tokens[this.tokens.length - 1];
  }

  private advance(): Token {
    return this.tokens[this.position++];
  }

  private expect(type: TokenType): Token {
    const token = this.advance();
    if (token.type !== type) {
      throw new Error(`Expected ${type} but got ${token.type} at line ${token.line}`);
    }
    return token;
  }

  private match(...types: TokenType[]): boolean {
    return types.includes(this.peek().type);
  }

  private skipNewlines(): void {
    while (this.match('NEWLINE')) {
      this.advance();
    }
  }

  public parse(): ASTNode {
    const statements: ASTNode[] = [];
    this.skipNewlines();
    
    while (!this.match('EOF')) {
      statements.push(this.parseStatement());
      this.skipNewlines();
    }

    return { type: 'Program', body: statements };
  }

  private parseStatement(): ASTNode {
    this.skipNewlines();
    
    if (this.match('SET')) {
      return this.parseSet();
    }
    if (this.match('VAR')) {
      return this.parseVar();
    }
    if (this.match('FUNC')) {
      return this.parseFunc();
    }
    if (this.match('IF')) {
      return this.parseIf();
    }
    if (this.match('FOR')) {
      return this.parseFor();
    }
    if (this.match('WHILE')) {
      return this.parseWhile();
    }
    if (this.match('RETURN')) {
      return this.parseReturn();
    }
    if (this.match('PRINT')) {
      return this.parsePrint();
    }
    if (this.match('CLASS')) {
      return this.parseClass();
    }
    if (this.match('IMPORT')) {
      return this.parseImport();
    }
    if (this.match('EXPORT')) {
      return this.parseExport();
    }
    if (this.match('IDENTIFIER')) {
      return this.parseExpressionStatement();
    }

    // Skip unknown tokens
    this.advance();
    return { type: 'Empty' };
  }

  private parseSet(): ASTNode {
    this.advance(); // consume SET
    
    // Check for new syntax: ~s=p*hello
    if (this.match('POINTER')) {
      const value = this.advance().value;
      return {
        type: 'SetDeclaration',
        name: '_ptr',
        value: { type: 'StringLiteral', value },
        pointer: true,
      };
    }

    const name = this.expect('IDENTIFIER').value;
    this.expect('ASSIGN');
    const value = this.parseExpression();
    
    return {
      type: 'SetDeclaration',
      name,
      value,
      pointer: false,
    };
  }

  private parseVar(): ASTNode {
    this.advance(); // consume VAR
    const name = this.expect('IDENTIFIER').value;
    this.expect('ASSIGN');
    const value = this.parseExpression();
    
    return {
      type: 'VariableDeclaration',
      name,
      value,
    };
  }

  private parseFunc(): ASTNode {
    this.advance(); // consume FUNC
    const name = this.expect('IDENTIFIER').value;
    this.expect('LPAREN');
    
    const params: string[] = [];
    while (!this.match('RPAREN') && !this.match('EOF')) {
      params.push(this.expect('IDENTIFIER').value);
      if (this.match('COMMA')) {
        this.advance();
      }
    }
    this.expect('RPAREN');
    
    this.expect('LBRACE');
    const body: ASTNode[] = [];
    while (!this.match('RBRACE') && !this.match('EOF')) {
      body.push(this.parseStatement());
      this.skipNewlines();
    }
    this.expect('RBRACE');
    
    return {
      type: 'FunctionDeclaration',
      name,
      params,
      body,
    };
  }

  private parseIf(): ASTNode {
    this.advance(); // consume IF
    const condition = this.parseExpression();
    this.expect('LBRACE');
    
    const consequent: ASTNode[] = [];
    while (!this.match('RBRACE') && !this.match('EOF')) {
      consequent.push(this.parseStatement());
      this.skipNewlines();
    }
    this.expect('RBRACE');
    
    let alternate: ASTNode[] | null = null;
    if (this.match('ELSE')) {
      this.advance();
      if (this.match('IF')) {
        alternate = [this.parseIf()];
      } else {
        this.expect('LBRACE');
        alternate = [];
        while (!this.match('RBRACE') && !this.match('EOF')) {
          alternate.push(this.parseStatement());
          this.skipNewlines();
        }
        this.expect('RBRACE');
      }
    }
    
    return {
      type: 'IfStatement',
      condition,
      consequent,
      alternate,
    };
  }

  private parseFor(): ASTNode {
    this.advance(); // consume FOR
    const iterator = this.expect('IDENTIFIER').value;
    this.expect('IDENTIFIER'); // 'in' keyword (treated as identifier)
    const iterable = this.parseExpression();
    this.expect('LBRACE');
    
    const body: ASTNode[] = [];
    while (!this.match('RBRACE') && !this.match('EOF')) {
      body.push(this.parseStatement());
      this.skipNewlines();
    }
    this.expect('RBRACE');
    
    return {
      type: 'ForLoop',
      iterator,
      iterable,
      body,
    };
  }

  private parseWhile(): ASTNode {
    this.advance(); // consume WHILE
    const condition = this.parseExpression();
    this.expect('LBRACE');
    
    const body: ASTNode[] = [];
    while (!this.match('RBRACE') && !this.match('EOF')) {
      body.push(this.parseStatement());
      this.skipNewlines();
    }
    this.expect('RBRACE');
    
    return {
      type: 'WhileLoop',
      condition,
      body,
    };
  }

  private parseReturn(): ASTNode {
    this.advance(); // consume RETURN
    const value = this.parseExpression();
    return {
      type: 'ReturnStatement',
      value,
    };
  }

  private parsePrint(): ASTNode {
    this.advance(); // consume PRINT
    const value = this.parseExpression();
    return {
      type: 'PrintStatement',
      value,
    };
  }

  private parseClass(): ASTNode {
    this.advance(); // consume CLASS
    const name = this.expect('IDENTIFIER').value;
    this.expect('LBRACE');
    
    const methods: ASTNode[] = [];
    while (!this.match('RBRACE') && !this.match('EOF')) {
      methods.push(this.parseStatement());
      this.skipNewlines();
    }
    this.expect('RBRACE');
    
    return {
      type: 'ClassDeclaration',
      name,
      methods,
    };
  }

  private parseImport(): ASTNode {
    this.advance(); // consume IMPORT
    const path = this.expect('STRING').value;
    return {
      type: 'ImportStatement',
      path,
    };
  }

  private parseExport(): ASTNode {
    this.advance(); // consume EXPORT
    const declaration = this.parseStatement();
    return {
      type: 'ExportStatement',
      declaration,
    };
  }

  private parseExpressionStatement(): ASTNode {
    const expr = this.parseExpression();
    return {
      type: 'ExpressionStatement',
      expression: expr,
    };
  }

  private parseExpression(): ASTNode {
    return this.parseAssignment();
  }

  private parseAssignment(): ASTNode {
    let left = this.parseOr();
    
    if (this.match('ASSIGN')) {
      const op = this.advance().value;
      const right = this.parseExpression();
      return {
        type: 'AssignmentExpression',
        operator: op,
        left,
        right,
      };
    }
    
    return left;
  }

  private parseOr(): ASTNode {
    let left = this.parseAnd();
    
    while (this.match('OR')) {
      this.advance();
      const right = this.parseAnd();
      left = {
        type: 'LogicalExpression',
        operator: '||',
        left,
        right,
      };
    }
    
    return left;
  }

  private parseAnd(): ASTNode {
    let left = this.parseEquality();
    
    while (this.match('AND')) {
      this.advance();
      const right = this.parseEquality();
      left = {
        type: 'LogicalExpression',
        operator: '&&',
        left,
        right,
      };
    }
    
    return left;
  }

  private parseEquality(): ASTNode {
    let left = this.parseComparison();
    
    while (this.match('EQ', 'NEQ')) {
      const op = this.advance().value;
      const right = this.parseComparison();
      left = {
        type: 'BinaryExpression',
        operator: op,
        left,
        right,
      };
    }
    
    return left;
  }

  private parseComparison(): ASTNode {
    let left = this.parseAdditive();
    
    while (this.match('LT', 'GT', 'LTE', 'GTE')) {
      const op = this.advance().value;
      const right = this.parseAdditive();
      left = {
        type: 'BinaryExpression',
        operator: op,
        left,
        right,
      };
    }
    
    return left;
  }

  private parseAdditive(): ASTNode {
    let left = this.parseMultiplicative();
    
    while (this.match('PLUS', 'MINUS')) {
      const op = this.advance().value;
      const right = this.parseMultiplicative();
      left = {
        type: 'BinaryExpression',
        operator: op,
        left,
        right,
      };
    }
    
    return left;
  }

  private parseMultiplicative(): ASTNode {
    let left = this.parseUnary();
    
    while (this.match('MULTIPLY', 'DIVIDE', 'MODULO')) {
      const op = this.advance().value;
      const right = this.parseUnary();
      left = {
        type: 'BinaryExpression',
        operator: op,
        left,
        right,
      };
    }
    
    return left;
  }

  private parseUnary(): ASTNode {
    if (this.match('NOT', 'MINUS')) {
      const op = this.advance().value;
      const operand = this.parseUnary();
      return {
        type: 'UnaryExpression',
        operator: op,
        operand,
      };
    }
    
    return this.parseCall();
  }

  private parseCall(): ASTNode {
    let callee = this.parsePrimary();
    
    if (this.match('LPAREN')) {
      this.advance();
      const args: ASTNode[] = [];
      while (!this.match('RPAREN') && !this.match('EOF')) {
        args.push(this.parseExpression());
        if (this.match('COMMA')) {
          this.advance();
        }
      }
      this.expect('RPAREN');
      
      return {
        type: 'CallExpression',
        callee,
        arguments: args,
      };
    }
    
    return callee;
  }

  private parsePrimary(): ASTNode {
    if (this.match('NUMBER')) {
      const value = this.advance().value;
      return {
        type: 'NumberLiteral',
        value: parseFloat(value),
      };
    }
    
    if (this.match('STRING')) {
      const value = this.advance().value;
      return {
        type: 'StringLiteral',
        value,
      };
    }
    
    if (this.match('BOOLEAN')) {
      const value = this.advance().value;
      return {
        type: 'BooleanLiteral',
        value: value === 'true',
      };
    }
    
    if (this.match('NULL')) {
      this.advance();
      return {
        type: 'NullLiteral',
        value: null,
      };
    }
    
    if (this.match('GET', 'IDENTIFIER')) {
      const name = this.advance().value;
      return {
        type: 'Identifier',
        name,
      };
    }
    
    if (this.match('LPAREN')) {
      this.advance();
      const expr = this.parseExpression();
      this.expect('RPAREN');
      return expr;
    }
    
    if (this.match('LBRACKET')) {
      return this.parseArray();
    }
    
    if (this.match('LBRACE')) {
      return this.parseObject();
    }
    
    // Fallback
    this.advance();
    return { type: 'Empty' };
  }

  private parseArray(): ASTNode {
    this.advance(); // consume [
    const elements: ASTNode[] = [];
    
    while (!this.match('RBRACKET') && !this.match('EOF')) {
      elements.push(this.parseExpression());
      if (this.match('COMMA')) {
        this.advance();
      }
    }
    
    this.expect('RBRACKET');
    return {
      type: 'ArrayLiteral',
      elements,
    };
  }

  private parseObject(): ASTNode {
    this.advance(); // consume {
    const properties: { key: string; value: ASTNode }[] = [];
    
    while (!this.match('RBRACE') && !this.match('EOF')) {
      const key = this.expect('IDENTIFIER').value;
      this.expect('COLON');
      const value = this.parseExpression();
      properties.push({ key, value });
      
      if (this.match('COMMA')) {
        this.advance();
      }
    }
    
    this.expect('RBRACE');
    return {
      type: 'ObjectLiteral',
      properties,
    };
  }
}

// Code Generator: Converts AST to C code
export class DroyCodeGenerator {
  private indentLevel: number = 0;
  private output: string = '';
  private includes: Set<string> = new Set();

  private indent(): string {
    return '  '.repeat(this.indentLevel);
  }

  private emit(line: string = ''): void {
    this.output += this.indent() + line + '\n';
  }

  public generate(ast: ASTNode): string {
    this.includes.add('#include <stdio.h>');
    this.includes.add('#include <stdlib.h>');
    this.includes.add('#include <string.h>');
    this.includes.add('#include <stdbool.h>');

    this.emit('/* Generated by Droy Compiler */');
    this.emit();

    // Generate forward declarations
    this.generateForwardDeclarations(ast);
    
    // Generate main function
    this.emit('int main() {');
    this.indentLevel++;
    
    if (ast.type === 'Program') {
      for (const stmt of ast.body) {
        this.generateStatement(stmt);
      }
    }
    
    this.emit('return 0;');
    this.indentLevel--;
    this.emit('}');

    // Prepend includes
    const includesStr = Array.from(this.includes).join('\n') + '\n\n';
    return includesStr + this.output;
  }

  private generateForwardDeclarations(ast: ASTNode): void {
    // Collect all function declarations for forward declaration
    if (ast.type === 'Program') {
      for (const stmt of ast.body) {
        if (stmt.type === 'FunctionDeclaration') {
          const params = stmt.params.map(() => 'void*').join(', ');
          this.emit(`void* ${stmt.name}(${params});`);
        }
      }
    }
    this.emit();
  }

  private generateStatement(node: ASTNode): void {
    switch (node.type) {
      case 'VariableDeclaration':
        this.generateVariableDeclaration(node);
        break;
      case 'SetDeclaration':
        this.generateSetDeclaration(node);
        break;
      case 'FunctionDeclaration':
        this.generateFunctionDeclaration(node);
        break;
      case 'IfStatement':
        this.generateIfStatement(node);
        break;
      case 'ForLoop':
        this.generateForLoop(node);
        break;
      case 'WhileLoop':
        this.generateWhileLoop(node);
        break;
      case 'ReturnStatement':
        this.generateReturnStatement(node);
        break;
      case 'PrintStatement':
        this.generatePrintStatement(node);
        break;
      case 'ExpressionStatement':
        this.generateExpression(node.expression);
        this.emit(';');
        break;
      case 'ClassDeclaration':
        this.generateClassDeclaration(node);
        break;
      case 'ImportStatement':
        // Imports handled separately
        break;
      case 'ExportStatement':
        this.generateStatement(node.declaration);
        break;
    }
  }

  private generateVariableDeclaration(node: ASTNode): void {
    const value = this.generateExpression(node.value);
    const type = this.inferType(node.value);
    this.emit(`${type} ${node.name} = ${value};`);
  }

  private generateSetDeclaration(node: ASTNode): void {
    const value = this.generateExpression(node.value);
    if (node.pointer) {
      this.emit(`const char* ${node.name} = "${value}";`);
    } else {
      const type = this.inferType(node.value);
      this.emit(`${type} ${node.name} = ${value};`);
    }
  }

  private generateFunctionDeclaration(node: ASTNode): void {
    const params = node.params.map((p: string) => `void* ${p}`).join(', ');
    this.emit(`void* ${node.name}(${params}) {`);
    this.indentLevel++;
    
    for (const stmt of node.body) {
      this.generateStatement(stmt);
    }
    
    this.indentLevel--;
    this.emit('}');
    this.emit();
  }

  private generateIfStatement(node: ASTNode): void {
    const condition = this.generateExpression(node.condition);
    this.emit(`if (${condition}) {`);
    this.indentLevel++;
    
    for (const stmt of node.consequent) {
      this.generateStatement(stmt);
    }
    
    this.indentLevel--;
    this.emit('}');
    
    if (node.alternate) {
      this.emit('else {');
      this.indentLevel++;
      
      for (const stmt of node.alternate) {
        this.generateStatement(stmt);
      }
      
      this.indentLevel--;
      this.emit('}');
    }
  }

  private generateForLoop(node: ASTNode): void {
    const iterable = this.generateExpression(node.iterable);
    this.emit(`// For loop: ${node.iterator} in ${iterable}`);
    this.emit(`for (int _i = 0; _i < array_length(${iterable}); _i++) {`);
    this.indentLevel++;
    this.emit(`void* ${node.iterator} = ${iterable}[_i];`);
    
    for (const stmt of node.body) {
      this.generateStatement(stmt);
    }
    
    this.indentLevel--;
    this.emit('}');
  }

  private generateWhileLoop(node: ASTNode): void {
    const condition = this.generateExpression(node.condition);
    this.emit(`while (${condition}) {`);
    this.indentLevel++;
    
    for (const stmt of node.body) {
      this.generateStatement(stmt);
    }
    
    this.indentLevel--;
    this.emit('}');
  }

  private generateReturnStatement(node: ASTNode): void {
    const value = this.generateExpression(node.value);
    this.emit(`return ${value};`);
  }

  private generatePrintStatement(node: ASTNode): void {
    const value = this.generateExpression(node.value);
    const type = this.inferType(node.value);
    
    if (type === 'char*' || type === 'const char*') {
      this.emit(`printf("%s\\n", ${value});`);
    } else if (type === 'int') {
      this.emit(`printf("%d\\n", ${value});`);
    } else if (type === 'double') {
      this.emit(`printf("%f\\n", ${value});`);
    } else if (type === 'bool') {
      this.emit(`printf("%s\\n", ${value} ? "true" : "false");`);
    } else {
      this.emit(`printf("%p\\n", ${value});`);
    }
  }

  private generateClassDeclaration(node: ASTNode): void {
    this.emit(`// Class: ${node.name}`);
    this.emit(`typedef struct ${node.name} {`);
    this.indentLevel++;
    // Add properties based on methods
    this.indentLevel--;
    this.emit(`} ${node.name};`);
    this.emit();
    
    for (const method of node.methods) {
      this.generateStatement(method);
    }
  }

  private generateExpression(node: ASTNode): string {
    switch (node.type) {
      case 'NumberLiteral':
        return String(node.value);
      case 'StringLiteral':
        return `"${node.value}"`;
      case 'BooleanLiteral':
        return node.value ? 'true' : 'false';
      case 'NullLiteral':
        return 'NULL';
      case 'Identifier':
        return node.name;
      case 'BinaryExpression':
        return this.generateBinaryExpression(node);
      case 'LogicalExpression':
        return this.generateLogicalExpression(node);
      case 'UnaryExpression':
        return this.generateUnaryExpression(node);
      case 'AssignmentExpression':
        return this.generateAssignmentExpression(node);
      case 'CallExpression':
        return this.generateCallExpression(node);
      case 'ArrayLiteral':
        return this.generateArrayLiteral(node);
      case 'ObjectLiteral':
        return this.generateObjectLiteral(node);
      default:
        return 'NULL';
    }
  }

  private generateBinaryExpression(node: ASTNode): string {
    const left = this.generateExpression(node.left);
    const right = this.generateExpression(node.right);
    return `(${left} ${node.operator} ${right})`;
  }

  private generateLogicalExpression(node: ASTNode): string {
    const left = this.generateExpression(node.left);
    const right = this.generateExpression(node.right);
    return `(${left} ${node.operator} ${right})`;
  }

  private generateUnaryExpression(node: ASTNode): string {
    const operand = this.generateExpression(node.operand);
    return `(${node.operator}${operand})`;
  }

  private generateAssignmentExpression(node: ASTNode): string {
    const left = this.generateExpression(node.left);
    const right = this.generateExpression(node.right);
    return `${left} ${node.operator} ${right}`;
  }

  private generateCallExpression(node: ASTNode): string {
    const callee = this.generateExpression(node.callee);
    const args = node.arguments.map((arg: ASTNode) => this.generateExpression(arg)).join(', ');
    return `${callee}(${args})`;
  }

  private generateArrayLiteral(node: ASTNode): string {
    const elements = node.elements.map((el: ASTNode) => this.generateExpression(el)).join(', ');
    return `(void*[]){${elements}}`;
  }

  private generateObjectLiteral(_node: ASTNode): string {
    // Simplified object representation
    return 'NULL /* Object literal */';
  }

  private inferType(node: ASTNode): string {
    switch (node.type) {
      case 'NumberLiteral':
        return Number.isInteger(node.value) ? 'int' : 'double';
      case 'StringLiteral':
        return 'char*';
      case 'BooleanLiteral':
        return 'bool';
      case 'NullLiteral':
        return 'void*';
      case 'ArrayLiteral':
        return 'void**';
      default:
        return 'void*';
    }
  }
}

// LLVM IR Generator
export class DroyLLVMGenerator {
  private output: string = '';
  private tempCounter: number = 0;
  private globalStrings: Map<string, string> = new Map();

  private getTemp(): string {
    return `%tmp${this.tempCounter++}`;
  }

  public generate(ast: ASTNode): string {
    this.emit('; ModuleID = "droy"');
    this.emit('source_filename = "droy"');
    this.emit();
    this.emit('declare i32 @printf(i8*, ...)');
    this.emit('declare i8* @malloc(i64)');
    this.emit('declare void @free(i8*)');
    this.emit('declare i8* @strcpy(i8*, i8*)');
    this.emit('declare i64 @strlen(i8*)');
    this.emit();

    // Generate global strings
    this.emit('@.str.format.int = private constant [4 x i8] c"%d\\0A\\00"');
    this.emit('@.str.format.float = private constant [4 x i8] c"%f\\0A\\00"');
    this.emit('@.str.format.str = private constant [4 x i8] c"%s\\0A\\00"');
    this.emit();

    // Generate main function
    this.emit('define i32 @main() {');
    this.emit('entry:');
    
    if (ast.type === 'Program') {
      for (const stmt of ast.body) {
        this.generateStatement(stmt);
      }
    }
    
    this.emit('  ret i32 0');
    this.emit('}');

    return this.output;
  }

  private emit(line: string = ''): void {
    this.output += line + '\n';
  }

  private generateStatement(node: ASTNode): void {
    switch (node.type) {
      case 'VariableDeclaration':
      case 'SetDeclaration':
        this.generateDeclaration(node);
        break;
      case 'PrintStatement':
        this.generatePrint(node);
        break;
      case 'IfStatement':
        this.generateIf(node);
        break;
      case 'WhileLoop':
        this.generateWhile(node);
        break;
      case 'FunctionDeclaration':
        this.generateFunction(node);
        break;
    }
  }

  private generateDeclaration(node: ASTNode): void {
    const value = this.generateExpression(node.value);
    const type = this.inferLLVMType(node.value);
    this.emit(`  %${node.name} = alloca ${type}`);
    this.emit(`  store ${type} ${value}, ${type}* %${node.name}`);
  }

  private generatePrint(node: ASTNode): void {
    const value = this.generateExpression(node.value);
    const type = this.inferLLVMType(node.value);
    
    if (type === 'i8*') {
      this.emit(`  call i32 (i8*, ...) @printf(i8* getelementptr inbounds ([4 x i8], [4 x i8]* @.str.format.str, i64 0, i64 0), i8* ${value})`);
    } else if (type === 'i32') {
      this.emit(`  call i32 (i8*, ...) @printf(i8* getelementptr inbounds ([4 x i8], [4 x i8]* @.str.format.int, i64 0, i64 0), i32 ${value})`);
    } else if (type === 'double') {
      this.emit(`  call i32 (i8*, ...) @printf(i8* getelementptr inbounds ([4 x i8], [4 x i8]* @.str.format.float, i64 0, i64 0), double ${value})`);
    }
  }

  private generateIf(node: ASTNode): void {
    const cond = this.generateExpression(node.condition);
    const thenLabel = `then${this.tempCounter}`;
    const elseLabel = `else${this.tempCounter}`;
    const endLabel = `endif${this.tempCounter}`;
    this.tempCounter++;

    this.emit(`  br i1 ${cond}, label %${thenLabel}, label %${elseLabel}`);
    this.emit();
    this.emit(`${thenLabel}:`);
    
    for (const stmt of node.consequent) {
      this.generateStatement(stmt);
    }
    this.emit(`  br label %${endLabel}`);
    this.emit();
    
    this.emit(`${elseLabel}:`);
    if (node.alternate) {
      for (const stmt of node.alternate) {
        this.generateStatement(stmt);
      }
    }
    this.emit(`  br label %${endLabel}`);
    this.emit();
    
    this.emit(`${endLabel}:`);
  }

  private generateWhile(node: ASTNode): void {
    const condLabel = `while.cond${this.tempCounter}`;
    const bodyLabel = `while.body${this.tempCounter}`;
    const endLabel = `while.end${this.tempCounter}`;
    this.tempCounter++;

    this.emit(`  br label %${condLabel}`);
    this.emit();
    this.emit(`${condLabel}:`);
    const cond = this.generateExpression(node.condition);
    this.emit(`  br i1 ${cond}, label %${bodyLabel}, label %${endLabel}`);
    this.emit();
    
    this.emit(`${bodyLabel}:`);
    for (const stmt of node.body) {
      this.generateStatement(stmt);
    }
    this.emit(`  br label %${condLabel}`);
    this.emit();
    
    this.emit(`${endLabel}:`);
  }

  private generateFunction(_node: ASTNode): void {
    // Function generation would go here
  }

  private generateExpression(node: ASTNode): string {
    switch (node.type) {
      case 'NumberLiteral':
        return Number.isInteger(node.value) ? `i32 ${node.value}` : `double ${node.value}`;
      case 'StringLiteral':
        const strName = `@.str.${this.tempCounter++}`;
        const len = node.value.length + 1;
        this.globalStrings.set(strName, node.value);
        this.emit(`${strName} = private constant [${len} x i8] c"${node.value}\\00"`);
        return `i8* getelementptr inbounds ([${len} x i8], [${len} x i8]* ${strName}, i64 0, i64 0)`;
      case 'BooleanLiteral':
        return `i1 ${node.value ? 1 : 0}`;
      case 'Identifier':
        const temp = this.getTemp();
        this.emit(`  ${temp} = load i32, i32* %${node.name}`);
        return temp;
      case 'BinaryExpression':
        return this.generateBinary(node);
      default:
        return 'i32 0';
    }
  }

  private generateBinary(node: ASTNode): string {
    const left = this.generateExpression(node.left);
    const right = this.generateExpression(node.right);
    const temp = this.getTemp();
    
    switch (node.operator) {
      case '+':
        this.emit(`  ${temp} = add i32 ${left.split(' ')[1]}, ${right.split(' ')[1]}`);
        break;
      case '-':
        this.emit(`  ${temp} = sub i32 ${left.split(' ')[1]}, ${right.split(' ')[1]}`);
        break;
      case '*':
        this.emit(`  ${temp} = mul i32 ${left.split(' ')[1]}, ${right.split(' ')[1]}`);
        break;
      case '/':
        this.emit(`  ${temp} = sdiv i32 ${left.split(' ')[1]}, ${right.split(' ')[1]}`);
        break;
    }
    
    return temp;
  }

  private inferLLVMType(node: ASTNode): string {
    switch (node.type) {
      case 'NumberLiteral':
        return Number.isInteger(node.value) ? 'i32' : 'double';
      case 'StringLiteral':
        return 'i8*';
      case 'BooleanLiteral':
        return 'i1';
      default:
        return 'i32';
    }
  }
}

// Main Compiler class
export class DroyCompiler {
  public compile(source: string): { tokens: Token[]; ast: ASTNode; cCode: string; llvmIR: string } {
    // Tokenize
    const lexer = new DroyLexer(source);
    const tokens = lexer.tokenize();

    // Parse
    const parser = new DroyParser(tokens);
    const ast = parser.parse();

    // Generate C code
    const cGenerator = new DroyCodeGenerator();
    const cCode = cGenerator.generate(ast);

    // Generate LLVM IR
    const llvmGenerator = new DroyLLVMGenerator();
    const llvmIR = llvmGenerator.generate(ast);

    return { tokens, ast, cCode, llvmIR };
  }

  public tokenize(source: string): Token[] {
    const lexer = new DroyLexer(source);
    return lexer.tokenize();
  }

  public parse(source: string): ASTNode {
    const lexer = new DroyLexer(source);
    const tokens = lexer.tokenize();
    const parser = new DroyParser(tokens);
    return parser.parse();
  }

  public generateC(source: string): string {
    const ast = this.parse(source);
    const generator = new DroyCodeGenerator();
    return generator.generate(ast);
  }

  public generateLLVM(source: string): string {
    const ast = this.parse(source);
    const generator = new DroyLLVMGenerator();
    return generator.generate(ast);
  }
}

export default DroyCompiler;
