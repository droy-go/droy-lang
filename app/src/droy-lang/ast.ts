// Droy Language AST Node Types

export type ASTNode =
  | Program
  | VariableDeclaration
  | Assignment
  | EmitStatement
  | ReturnStatement
  | IfStatement
  | ForStatement
  | FunctionDeclaration
  | FunctionCall
  | BinaryExpression
  | UnaryExpression
  | Literal
  | Identifier
  | SpecialVariable
  | LinkStatement
  | BlockStatement
  | StyleBlock
  | CommandStatement;

export interface Program {
  type: 'Program';
  body: ASTNode[];
}

export interface VariableDeclaration {
  type: 'VariableDeclaration';
  name: string;
  value: ASTNode;
  isSpecial: boolean;
}

export interface Assignment {
  type: 'Assignment';
  name: string;
  value: ASTNode;
  isSpecial: boolean;
}

export interface EmitStatement {
  type: 'EmitStatement';
  expression: ASTNode;
}

export interface ReturnStatement {
  type: 'ReturnStatement';
  expression: ASTNode | null;
}

export interface IfStatement {
  type: 'IfStatement';
  condition: ASTNode;
  consequent: ASTNode;
  alternate: ASTNode | null;
}

export interface ForStatement {
  type: 'ForStatement';
  init: ASTNode | null;
  condition: ASTNode | null;
  update: ASTNode | null;
  body: ASTNode;
}

export interface FunctionDeclaration {
  type: 'FunctionDeclaration';
  name: string;
  params: string[];
  body: ASTNode[];
}

export interface FunctionCall {
  type: 'FunctionCall';
  name: string;
  args: ASTNode[];
}

export interface BinaryExpression {
  type: 'BinaryExpression';
  operator: string;
  left: ASTNode;
  right: ASTNode;
}

export interface UnaryExpression {
  type: 'UnaryExpression';
  operator: string;
  operand: ASTNode;
}

export interface Literal {
  type: 'Literal';
  value: string | number;
  raw: string;
}

export interface Identifier {
  type: 'Identifier';
  name: string;
}

export interface SpecialVariable {
  type: 'SpecialVariable';
  name: string;
}

export interface LinkStatement {
  type: 'LinkStatement';
  id: string;
  api: string;
}

export interface BlockStatement {
  type: 'BlockStatement';
  body: ASTNode[];
}

export interface StyleBlock {
  type: 'StyleBlock';
  properties: Record<string, ASTNode>;
}

export interface CommandStatement {
  type: 'CommandStatement';
  command: string;
}

// Helper functions to create AST nodes
export const createProgram = (body: ASTNode[]): Program => ({
  type: 'Program',
  body,
});

export const createVariableDeclaration = (
  name: string,
  value: ASTNode,
  isSpecial: boolean = false
): VariableDeclaration => ({
  type: 'VariableDeclaration',
  name,
  value,
  isSpecial,
});

export const createAssignment = (
  name: string,
  value: ASTNode,
  isSpecial: boolean = false
): Assignment => ({
  type: 'Assignment',
  name,
  value,
  isSpecial,
});

export const createEmitStatement = (expression: ASTNode): EmitStatement => ({
  type: 'EmitStatement',
  expression,
});

export const createReturnStatement = (expression: ASTNode | null): ReturnStatement => ({
  type: 'ReturnStatement',
  expression,
});

export const createIfStatement = (
  condition: ASTNode,
  consequent: ASTNode,
  alternate: ASTNode | null = null
): IfStatement => ({
  type: 'IfStatement',
  condition,
  consequent,
  alternate,
});

export const createForStatement = (
  init: ASTNode | null,
  condition: ASTNode | null,
  update: ASTNode | null,
  body: ASTNode
): ForStatement => ({
  type: 'ForStatement',
  init,
  condition,
  update,
  body,
});

export const createFunctionDeclaration = (
  name: string,
  params: string[],
  body: ASTNode[]
): FunctionDeclaration => ({
  type: 'FunctionDeclaration',
  name,
  params,
  body,
});

export const createFunctionCall = (name: string, args: ASTNode[]): FunctionCall => ({
  type: 'FunctionCall',
  name,
  args,
});

export const createBinaryExpression = (
  operator: string,
  left: ASTNode,
  right: ASTNode
): BinaryExpression => ({
  type: 'BinaryExpression',
  operator,
  left,
  right,
});

export const createUnaryExpression = (operator: string, operand: ASTNode): UnaryExpression => ({
  type: 'UnaryExpression',
  operator,
  operand,
});

export const createLiteral = (value: string | number, raw: string): Literal => ({
  type: 'Literal',
  value,
  raw,
});

export const createIdentifier = (name: string): Identifier => ({
  type: 'Identifier',
  name,
});

export const createSpecialVariable = (name: string): SpecialVariable => ({
  type: 'SpecialVariable',
  name,
});

export const createLinkStatement = (id: string, api: string): LinkStatement => ({
  type: 'LinkStatement',
  id,
  api,
});

export const createBlockStatement = (body: ASTNode[]): BlockStatement => ({
  type: 'BlockStatement',
  body,
});

export const createStyleBlock = (properties: Record<string, ASTNode>): StyleBlock => ({
  type: 'StyleBlock',
  properties,
});

export const createCommandStatement = (command: string): CommandStatement => ({
  type: 'CommandStatement',
  command,
});
