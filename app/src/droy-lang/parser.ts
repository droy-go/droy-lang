// Droy Language Parser

import { type Token, TokenType, type TokenTypeValue } from './lexer';
import * as AST from './ast';

export class Parser {
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
    const token = this.peek();
    this.position++;
    return token;
  }

  private expect(type: TokenTypeValue): Token {
    const token = this.peek();
    if (token.type !== type) {
      throw new Error(`Expected ${type} but got ${token.type} at line ${token.line}`);
    }
    return this.advance();
  }

  private match(...types: TokenTypeValue[]): boolean {
    return types.includes(this.peek().type);
  }

  private skipNewlines(): void {
    while (this.match(TokenType.NEWLINE)) {
      this.advance();
    }
  }

  public parse(): AST.Program {
    const body: AST.ASTNode[] = [];

    while (!this.match(TokenType.EOF)) {
      this.skipNewlines();
      if (this.match(TokenType.EOF)) break;

      const stmt = this.parseStatement();
      if (stmt) {
        body.push(stmt);
      }
      this.skipNewlines();
    }

    return AST.createProgram(body);
  }

  private parseStatement(): AST.ASTNode | null {
    this.skipNewlines();

    if (this.match(TokenType.COMMENT)) {
      this.advance(); // Skip comment
      return null;
    }

    if (this.match(TokenType.SET, TokenType.TILDE_S)) {
      return this.parseVariableDeclaration();
    }

    if (this.match(TokenType.EM, TokenType.TILDE_E)) {
      return this.parseEmitStatement();
    }

    if (this.match(TokenType.RET, TokenType.TILDE_R)) {
      return this.parseReturnStatement();
    }

    if (this.match(TokenType.FE)) {
      return this.parseIfStatement();
    }

    if (this.match(TokenType.F)) {
      return this.parseFunctionDeclaration();
    }

    if (this.match(TokenType.FOR)) {
      return this.parseForStatement();
    }

    if (this.match(TokenType.LINK)) {
      return this.parseLinkStatement();
    }

    if (this.match(TokenType.STY)) {
      return this.parseStyleBlock();
    }

    if (this.match(TokenType.IDENTIFIER)) {
      const id = this.peek().value;
      // Check for command (*/something)
      if (id.startsWith('*/')) {
        this.advance();
        return AST.createCommandStatement(id);
      }
      // Check for function call
      if (this.peek(1).type === TokenType.LPAREN) {
        return this.parseFunctionCall();
      }
      // Assignment
      if (this.peek(1).type === TokenType.ASSIGN) {
        return this.parseAssignment();
      }
    }

    if (this.match(TokenType.SPECIAL_VAR)) {
      return this.parseSpecialVarAssignment();
    }

    // Skip unknown tokens
    this.advance();
    return null;
  }

  private parseVariableDeclaration(): AST.VariableDeclaration {
    this.advance(); // skip set or ~s
    this.skipNewlines();

    let name: string;
    let isSpecial = false;

    if (this.match(TokenType.IDENTIFIER)) {
      name = this.advance().value;
    } else if (this.match(TokenType.SPECIAL_VAR)) {
      name = this.advance().value;
      isSpecial = true;
    } else {
      throw new Error(`Expected identifier at line ${this.peek().line}`);
    }

    this.expect(TokenType.ASSIGN);
    const value = this.parseExpression();

    return AST.createVariableDeclaration(name, value, isSpecial);
  }

  private parseAssignment(): AST.Assignment {
    const name = this.advance().value;
    this.expect(TokenType.ASSIGN);
    const value = this.parseExpression();
    return AST.createAssignment(name, value, false);
  }

  private parseSpecialVarAssignment(): AST.Assignment {
    const name = this.advance().value;
    this.expect(TokenType.ASSIGN);
    const value = this.parseExpression();
    return AST.createAssignment(name, value, true);
  }

  private parseEmitStatement(): AST.EmitStatement {
    this.advance(); // skip em or ~e
    const expression = this.parseExpression();
    return AST.createEmitStatement(expression);
  }

  private parseReturnStatement(): AST.ReturnStatement {
    this.advance(); // skip ret or ~r
    if (this.match(TokenType.NEWLINE, TokenType.EOF, TokenType.RBRACE)) {
      return AST.createReturnStatement(null);
    }
    const expression = this.parseExpression();
    return AST.createReturnStatement(expression);
  }

  private parseIfStatement(): AST.IfStatement {
    this.advance(); // skip fe
    this.expect(TokenType.LPAREN);
    const condition = this.parseExpression();
    this.expect(TokenType.RPAREN);

    let consequent: AST.ASTNode;
    if (this.match(TokenType.LBRACE)) {
      consequent = this.parseBlockStatement();
    } else {
      const stmt = this.parseStatement();
      consequent = stmt || AST.createBlockStatement([]);
    }

    // Note: Droy doesn't seem to have else, but we'll support it if added
    return AST.createIfStatement(condition, consequent, null);
  }

  private parseForStatement(): AST.ForStatement {
    this.advance(); // skip for
    this.expect(TokenType.LPAREN);

    let init: AST.ASTNode | null = null;
    if (!this.match(TokenType.SEMICOLON)) {
      init = this.parseStatement();
    }
    this.expect(TokenType.SEMICOLON);

    let condition: AST.ASTNode | null = null;
    if (!this.match(TokenType.SEMICOLON)) {
      condition = this.parseExpression();
    }
    this.expect(TokenType.SEMICOLON);

    let update: AST.ASTNode | null = null;
    if (!this.match(TokenType.RPAREN)) {
      update = this.parseExpression();
    }
    this.expect(TokenType.RPAREN);

    let body: AST.ASTNode;
    if (this.match(TokenType.LBRACE)) {
      body = this.parseBlockStatement();
    } else {
      const stmt = this.parseStatement();
      body = stmt || AST.createBlockStatement([]);
    }

    return AST.createForStatement(init, condition, update, body);
  }

  private parseFunctionDeclaration(): AST.FunctionDeclaration {
    this.advance(); // skip f
    const name = this.expect(TokenType.IDENTIFIER).value;
    this.expect(TokenType.LPAREN);

    const params: string[] = [];
    while (!this.match(TokenType.RPAREN)) {
      if (params.length > 0) {
        this.expect(TokenType.COMMA);
      }
      params.push(this.expect(TokenType.IDENTIFIER).value);
    }
    this.expect(TokenType.RPAREN);

    const body = this.parseBlockStatement();
    return AST.createFunctionDeclaration(name, params, body.body);
  }

  private parseFunctionCall(): AST.FunctionCall {
    const name = this.advance().value;
    this.expect(TokenType.LPAREN);

    const args: AST.ASTNode[] = [];
    while (!this.match(TokenType.RPAREN)) {
      if (args.length > 0) {
        this.expect(TokenType.COMMA);
      }
      args.push(this.parseExpression());
    }
    this.expect(TokenType.RPAREN);

    return AST.createFunctionCall(name, args);
  }

  private parseLinkStatement(): AST.LinkStatement {
    this.advance(); // skip link
    this.expect(TokenType.IDENTIFIER); // id:
    this.expect(TokenType.COLON);
    const id = this.expect(TokenType.STRING).value;
    this.expect(TokenType.IDENTIFIER); // api:
    this.expect(TokenType.COLON);
    const api = this.expect(TokenType.STRING).value;
    return AST.createLinkStatement(id, api);
  }

  private parseBlockStatement(): AST.BlockStatement {
    this.expect(TokenType.LBRACE);
    this.skipNewlines();

    const body: AST.ASTNode[] = [];
    while (!this.match(TokenType.RBRACE, TokenType.EOF)) {
      const stmt = this.parseStatement();
      if (stmt) {
        body.push(stmt);
      }
      this.skipNewlines();
    }

    this.expect(TokenType.RBRACE);
    return AST.createBlockStatement(body);
  }

  private parseStyleBlock(): AST.StyleBlock {
    this.advance(); // skip sty
    this.expect(TokenType.LBRACE);
    this.skipNewlines();

    const properties: Record<string, AST.ASTNode> = {};
    while (!this.match(TokenType.RBRACE, TokenType.EOF)) {
      if (this.match(TokenType.SET)) {
        this.advance();
        const propName = this.expect(TokenType.IDENTIFIER).value;
        this.expect(TokenType.ASSIGN);
        const value = this.parseExpression();
        properties[propName] = value;
      }
      this.skipNewlines();
    }

    this.expect(TokenType.RBRACE);
    return AST.createStyleBlock(properties);
  }

  private parseExpression(): AST.ASTNode {
    return this.parseAdditiveExpression();
  }

  private parseAdditiveExpression(): AST.ASTNode {
    let left = this.parseMultiplicativeExpression();

    while (this.match(TokenType.PLUS, TokenType.MINUS)) {
      const operator = this.advance().value;
      const right = this.parseMultiplicativeExpression();
      left = AST.createBinaryExpression(operator, left, right);
    }

    return left;
  }

  private parseMultiplicativeExpression(): AST.ASTNode {
    let left = this.parseComparisonExpression();

    while (this.match(TokenType.MULTIPLY, TokenType.DIVIDE)) {
      const operator = this.advance().value;
      const right = this.parseComparisonExpression();
      left = AST.createBinaryExpression(operator, left, right);
    }

    return left;
  }

  private parseComparisonExpression(): AST.ASTNode {
    let left = this.parsePrimaryExpression();

    while (this.match(TokenType.GT, TokenType.LT, TokenType.EQ)) {
      const operator = this.advance().value;
      const right = this.parsePrimaryExpression();
      left = AST.createBinaryExpression(operator, left, right);
    }

    return left;
  }

  private parsePrimaryExpression(): AST.ASTNode {
    if (this.match(TokenType.STRING)) {
      const token = this.advance();
      return AST.createLiteral(token.value, `"${token.value}"`);
    }

    if (this.match(TokenType.NUMBER)) {
      const token = this.advance();
      return AST.createLiteral(parseFloat(token.value), token.value);
    }

    if (this.match(TokenType.IDENTIFIER)) {
      if (this.peek(1).type === TokenType.LPAREN) {
        return this.parseFunctionCall();
      }
      return AST.createIdentifier(this.advance().value);
    }

    if (this.match(TokenType.SPECIAL_VAR)) {
      return AST.createSpecialVariable(this.advance().value);
    }

    if (this.match(TokenType.LPAREN)) {
      this.advance();
      const expr = this.parseExpression();
      this.expect(TokenType.RPAREN);
      return expr;
    }

    // Return empty literal for unexpected tokens
    return AST.createLiteral('', '');
  }
}

export default Parser;
