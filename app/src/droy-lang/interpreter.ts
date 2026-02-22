// Droy Language Interpreter

import * as AST from './ast';

export interface ExecutionResult {
  output: string[];
  returnValue: unknown;
  error?: string;
}

interface FunctionDef {
  params: string[];
  body: AST.ASTNode[];
}

export class Interpreter {
  private variables: Map<string, unknown> = new Map();
  private specialVars: Map<string, unknown> = new Map();
  private functions: Map<string, FunctionDef> = new Map();
  private output: string[] = [];
  private returnValue: unknown = null;
  private inFunction: boolean = false;

  constructor() {
    // Initialize special variables
    this.specialVars.set('@si', '');
    this.specialVars.set('@ui', '');
    this.specialVars.set('@yui', '');
    this.specialVars.set('@pop', '');
    this.specialVars.set('@abc', '');
  }

  public execute(node: AST.Program): ExecutionResult {
    this.output = [];
    this.returnValue = null;

    try {
      for (const stmt of node.body) {
        this.executeNode(stmt);
      }
    } catch (error) {
      return {
        output: this.output,
        returnValue: this.returnValue,
        error: error instanceof Error ? error.message : String(error),
      };
    }

    return {
      output: this.output,
      returnValue: this.returnValue,
    };
  }

  private executeNode(node: AST.ASTNode): unknown {
    switch (node.type) {
      case 'VariableDeclaration':
        return this.executeVariableDeclaration(node);
      case 'Assignment':
        return this.executeAssignment(node);
      case 'EmitStatement':
        return this.executeEmitStatement(node);
      case 'ReturnStatement':
        return this.executeReturnStatement(node);
      case 'IfStatement':
        return this.executeIfStatement(node);
      case 'ForStatement':
        return this.executeForStatement(node);
      case 'FunctionDeclaration':
        return this.executeFunctionDeclaration(node);
      case 'FunctionCall':
        return this.executeFunctionCall(node);
      case 'BinaryExpression':
        return this.executeBinaryExpression(node);
      case 'UnaryExpression':
        return this.executeUnaryExpression(node);
      case 'Literal':
        return node.value;
      case 'Identifier':
        return this.getVariable(node.name);
      case 'SpecialVariable':
        return this.specialVars.get(node.name) ?? '';
      case 'LinkStatement':
        return this.executeLinkStatement(node);
      case 'BlockStatement':
        return this.executeBlockStatement(node);
      case 'StyleBlock':
        return this.executeStyleBlock(node);
      case 'CommandStatement':
        return this.executeCommandStatement(node);
      default:
        return null;
    }
  }

  private executeVariableDeclaration(node: AST.VariableDeclaration): unknown {
    const value = this.executeNode(node.value);
    if (node.isSpecial) {
      this.specialVars.set(node.name, value);
    } else {
      this.variables.set(node.name, value);
    }
    return value;
  }

  private executeAssignment(node: AST.Assignment): unknown {
    const value = this.executeNode(node.value);
    if (node.isSpecial) {
      this.specialVars.set(node.name, value);
    } else {
      this.variables.set(node.name, value);
    }
    return value;
  }

  private executeEmitStatement(node: AST.EmitStatement): unknown {
    const value = this.executeNode(node.expression);
    const strValue = this.valueToString(value);
    this.output.push(strValue);
    return value;
  }

  private executeReturnStatement(node: AST.ReturnStatement): unknown {
    if (node.expression) {
      this.returnValue = this.executeNode(node.expression);
    }
    this.inFunction = false;
    return this.returnValue;
  }

  private executeIfStatement(node: AST.IfStatement): unknown {
    const condition = this.executeNode(node.condition);
    if (this.isTruthy(condition)) {
      return this.executeNode(node.consequent);
    } else if (node.alternate) {
      return this.executeNode(node.alternate);
    }
    return null;
  }

  private executeForStatement(node: AST.ForStatement): unknown {
    // Execute init
    if (node.init) {
      this.executeNode(node.init);
    }

    let result: unknown = null;

    // Loop
    while (true) {
      // Check condition
      if (node.condition) {
        const condition = this.executeNode(node.condition);
        if (!this.isTruthy(condition)) {
          break;
        }
      }

      // Execute body
      result = this.executeNode(node.body);

      // Execute update
      if (node.update) {
        this.executeNode(node.update);
      }
    }

    return result;
  }

  private executeFunctionDeclaration(node: AST.FunctionDeclaration): unknown {
    this.functions.set(node.name, {
      params: node.params,
      body: node.body,
    });
    return null;
  }

  private executeFunctionCall(node: AST.FunctionCall): unknown {
    const func = this.functions.get(node.name);
    if (!func) {
      // Built-in functions
      if (node.name === 'text' || node.name === 'txt' || node.name === 't') {
        const value = node.args.map(arg => this.valueToString(this.executeNode(arg))).join(' ');
        this.output.push(value);
        return value;
      }
      throw new Error(`Function '${node.name}' is not defined`);
    }

    if (node.args.length !== func.params.length) {
      throw new Error(
        `Function '${node.name}' expects ${func.params.length} arguments but got ${node.args.length}`
      );
    }

    // Save current scope
    const savedVars = new Map(this.variables);
    const savedInFunction = this.inFunction;
    const savedReturnValue = this.returnValue;

    // Set up new scope
    this.inFunction = true;
    this.returnValue = null;

    // Bind arguments
    for (let i = 0; i < func.params.length; i++) {
      this.variables.set(func.params[i], this.executeNode(node.args[i]));
    }

    // Execute function body
    for (const stmt of func.body) {
      this.executeNode(stmt);
      if (!this.inFunction) {
        // Return was called
        break;
      }
    }

    const result = this.returnValue;

    // Restore scope
    this.variables = savedVars;
    this.inFunction = savedInFunction;
    this.returnValue = savedReturnValue;

    return result;
  }

  private executeBinaryExpression(node: AST.BinaryExpression): unknown {
    const left = this.executeNode(node.left);
    const right = this.executeNode(node.right);

    switch (node.operator) {
      case '+':
        if (typeof left === 'number' && typeof right === 'number') {
          return left + right;
        }
        return this.valueToString(left) + this.valueToString(right);
      case '-':
        if (typeof left === 'number' && typeof right === 'number') {
          return left - right;
        }
        return Number(left) - Number(right);
      case '*':
        return Number(left) * Number(right);
      case '/':
        if (Number(right) === 0) {
          throw new Error('Division by zero');
        }
        return Number(left) / Number(right);
      case '>':
        return Number(left) > Number(right);
      case '<':
        return Number(left) < Number(right);
      case '==':
        return left === right;
      default:
        throw new Error(`Unknown operator: ${node.operator}`);
    }
  }

  private executeUnaryExpression(node: AST.UnaryExpression): unknown {
    const operand = this.executeNode(node.operand);
    switch (node.operator) {
      case '-':
        return -Number(operand);
      case '!':
        return !this.isTruthy(operand);
      default:
        throw new Error(`Unknown unary operator: ${node.operator}`);
    }
  }

  private executeLinkStatement(node: AST.LinkStatement): unknown {
    // Store link in a special variable
    const linkKey = `__link_${node.id}`;
    this.variables.set(linkKey, { id: node.id, api: node.api });
    return null;
  }

  private executeBlockStatement(node: AST.BlockStatement): unknown {
    let result: unknown = null;
    for (const stmt of node.body) {
      result = this.executeNode(stmt);
      if (!this.inFunction && this.returnValue !== null) {
        break;
      }
    }
    return result;
  }

  private executeStyleBlock(_node: AST.StyleBlock): unknown {
    // Style blocks don't produce output in the interpreter
    // They would be used for rendering in a visual context
    return null;
  }

  private executeCommandStatement(_node: AST.CommandStatement): unknown {
    // Commands like */employment, */Running, etc.
    // These are system commands that don't produce direct output
    return null;
  }

  private getVariable(name: string): unknown {
    if (this.variables.has(name)) {
      return this.variables.get(name);
    }
    if (this.specialVars.has(name)) {
      return this.specialVars.get(name);
    }
    return '';
  }

  private valueToString(value: unknown): string {
    if (value === null || value === undefined) {
      return '';
    }
    if (typeof value === 'boolean') {
      return value ? 'true' : 'false';
    }
    return String(value);
  }

  private isTruthy(value: unknown): boolean {
    if (value === null || value === undefined) return false;
    if (typeof value === 'boolean') return value;
    if (typeof value === 'number') return value !== 0;
    if (typeof value === 'string') return value.length > 0;
    return true;
  }
}

export default Interpreter;
