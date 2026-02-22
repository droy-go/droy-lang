// Droy Language - Complete Interpreter
// A complete markup and programming language built in TypeScript

export { Lexer, type Token, TokenType } from './lexer';
export { Parser } from './parser';
export { Interpreter, type ExecutionResult } from './interpreter';
export * as AST from './ast';

import { Lexer } from './lexer';
import { Parser } from './parser';
import { Interpreter, type ExecutionResult } from './interpreter';

// Main entry point for running Droy code
export function execute(code: string): ExecutionResult {
  // Tokenize
  const lexer = new Lexer(code);
  const tokens = lexer.tokenize();

  // Parse
  const parser = new Parser(tokens);
  const ast = parser.parse();

  // Execute
  const interpreter = new Interpreter();
  return interpreter.execute(ast);
}

// Get tokens for syntax highlighting
export function getTokens(code: string) {
  const lexer = new Lexer(code);
  return lexer.tokenize();
}

// Get AST for analysis
export function getAST(code: string) {
  const lexer = new Lexer(code);
  const tokens = lexer.tokenize();

  const parser = new Parser(tokens);
  return parser.parse();
}

export default {
  execute,
  getTokens,
  getAST,
};
