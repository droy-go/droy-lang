# Droy Language API Documentation

This document provides detailed information about the Droy Language internal API for developers who want to extend or modify the language.

## Table of Contents

- [Core Data Structures](#core-data-structures)
- [Lexer API](#lexer-api)
- [Parser API](#parser-api)
- [Interpreter API](#interpreter-api)
- [Value System](#value-system)
- [Memory Management](#memory-management)

---

## Core Data Structures

### Token

Represents a lexical token in the Droy language.

```c
typedef struct {
    TokenType type;      // Type of the token
    char* value;         // String value of the token
    int line;            // Line number in source
    int column;          // Column number in source
} Token;
```

### TokenType

Enumeration of all token types in Droy:

```c
typedef enum {
    // Literals
    TOKEN_NUMBER,        // Integer or float literal
    TOKEN_STRING,        // String literal
    
    // Keywords
    TOKEN_SET,           // 'set' or '~s'
    TOKEN_RET,           // 'ret' or '~r'
    TOKEN_EM,            // 'em' or '~e'
    TOKEN_TEXT,          // 'text', 'txt', or 't'
    TOKEN_FE,            // 'fe' (if)
    TOKEN_F,             // 'f' (function)
    TOKEN_FOR,           // 'for' loop
    TOKEN_STY,           // 'sty' (style block)
    TOKEN_PKG,           // 'pkg' (package)
    TOKEN_MEDIA,         // 'media'
    TOKEN_LINK,          // 'link'
    TOKEN_BLOCK,         // 'block'
    
    // Special variables
    TOKEN_VAR_SI,        // '@si'
    TOKEN_VAR_UI,        // '@ui'
    TOKEN_VAR_YUI,       // '@yui'
    TOKEN_VAR_POP,       // '@pop'
    TOKEN_VAR_ABC,       // '@abc'
    
    // Operators
    TOKEN_PLUS,          // '+'
    TOKEN_MINUS,         // '-'
    TOKEN_MUL,           // '*'
    TOKEN_DIV,           // '/'
    TOKEN_ASSIGN,        // '='
    
    // Delimiters
    TOKEN_LPAREN,        // '('
    TOKEN_RPAREN,        // ')'
    TOKEN_LBRACE,        // '{'
    TOKEN_RBRACE,        // '}'
    TOKEN_LBRACKET,      // '['
    TOKEN_RBRACKET,      // ']'
    TOKEN_COLON,         // ':'
    TOKEN_SEMICOLON,     // ';'
    TOKEN_COMMA,         // ','
    
    // Other
    TOKEN_IDENTIFIER,    // Variable/function name
    TOKEN_COMMENT,       // Comment
    TOKEN_NEWLINE,       // New line
    TOKEN_EOF,           // End of file
    TOKEN_ERROR          // Error token
} TokenType;
```

### ASTNode

Represents a node in the Abstract Syntax Tree.

```c
typedef struct ASTNode {
    ASTNodeType type;           // Type of the node
    struct ASTNode* left;       // Left child
    struct ASTNode* right;      // Right child
    struct ASTNode** children;  // Array of children (for blocks)
    int child_count;            // Number of children
    Value value;                // Node value
    char* name;                 // Identifier name
} ASTNode;
```

### ASTNodeType

```c
typedef enum {
    AST_PROGRAM,         // Root node
    AST_VAR_DECL,        // Variable declaration
    AST_ASSIGN,          // Assignment
    AST_BIN_OP,          // Binary operation
    AST_UNARY_OP,        // Unary operation
    AST_NUMBER,          // Number literal
    AST_STRING,          // String literal
    AST_IDENTIFIER,      // Identifier reference
    AST_EMIT,            // Emit statement
    AST_TEXT,            // Text statement
    AST_RETURN,          // Return statement
    AST_IF,              // If statement
    AST_FOR,             // For loop
    AST_BLOCK,           // Code block
    AST_STYLE,           // Style block
    AST_LINK,            // Link definition
    AST_FUNCTION,        // Function definition
    AST_CALL,            // Function call
    AST_ARRAY,           // Array literal
    AST_INDEX,           // Array index
    AST_COMMAND          // Special command
} ASTNodeType;
```

---

## Lexer API

### init_lexer

Initializes a lexer with the given input string.

```c
void init_lexer(Lexer* lexer, const char* input);
```

**Parameters:**
- `lexer` - Pointer to lexer state to initialize
- `input` - Source code string to tokenize

**Example:**
```c
Lexer lexer;
init_lexer(&lexer, "set x = 5");
```

### next_token

Gets the next token from the input.

```c
Token next_token(Lexer* lexer);
```

**Parameters:**
- `lexer` - Pointer to lexer state

**Returns:** The next token from the input

**Example:**
```c
Token token = next_token(&lexer);
if (token.type == TOKEN_SET) {
    printf("Found 'set' keyword\\n");
}
```

### free_token

Frees memory allocated for a token.

```c
void free_token(Token* token);
```

**Parameters:**
- `token` - Pointer to token to free

---

## Parser API

### parse

Parses input string into an Abstract Syntax Tree.

```c
ASTNode* parse(const char* input);
```

**Parameters:**
- `input` - Source code string to parse

**Returns:** Root node of the AST, or NULL on error

**Example:**
```c
ASTNode* ast = parse("set x = 5");
if (ast != NULL) {
    // Process AST
    free_ast(ast);
}
```

### parse_expression

Parses an expression from the lexer.

```c
ASTNode* parse_expression(Lexer* lexer);
```

**Parameters:**
- `lexer` - Pointer to lexer state

**Returns:** AST node representing the expression

### parse_statement

Parses a statement from the lexer.

```c
ASTNode* parse_statement(Lexer* lexer);
```

**Parameters:**
- `lexer` - Pointer to lexer state

**Returns:** AST node representing the statement

### free_ast

Frees memory allocated for an AST.

```c
void free_ast(ASTNode* node);
```

**Parameters:**
- `node` - Root node of the AST to free

---

## Interpreter API

### init_interpreter

Initializes the interpreter state.

```c
void init_interpreter(Interpreter* interpreter);
```

**Parameters:**
- `interpreter` - Pointer to interpreter state to initialize

**Example:**
```c
Interpreter interpreter;
init_interpreter(&interpreter);
```

### interpret

Interprets Droy source code.

```c
Value interpret(Interpreter* interpreter, const char* input);
```

**Parameters:**
- `interpreter` - Pointer to interpreter state
- `input` - Source code string to interpret

**Returns:** The result value of the interpretation

**Example:**
```c
Interpreter interpreter;
init_interpreter(&interpreter);
Value result = interpret(&interpreter, "set x = 5");
if (result.type == VALUE_NUMBER) {
    printf("Result: %f\\n", result.number);
}
```

### evaluate

Evaluates an AST node.

```c
Value evaluate(Interpreter* interpreter, ASTNode* node);
```

**Parameters:**
- `interpreter` - Pointer to interpreter state
- `node` - AST node to evaluate

**Returns:** The evaluated value

### get_variable

Gets a variable's value from the interpreter.

```c
Value* get_variable(Interpreter* interpreter, const char* name);
```

**Parameters:**
- `interpreter` - Pointer to interpreter state
- `name` - Variable name

**Returns:** Pointer to the variable's value, or NULL if not found

**Example:**
```c
Value* x_val = get_variable(&interpreter, "x");
if (x_val != NULL && x_val->type == VALUE_NUMBER) {
    printf("x = %f\\n", x_val->number);
}
```

### set_variable

Sets a variable's value in the interpreter.

```c
void set_variable(Interpreter* interpreter, const char* name, Value value);
```

**Parameters:**
- `interpreter` - Pointer to interpreter state
- `name` - Variable name
- `value` - Value to set

---

## Value System

### ValueType

```c
typedef enum {
    VALUE_NUMBER,        // Numeric value
    VALUE_STRING,        // String value
    VALUE_BOOL,          // Boolean value
    VALUE_ARRAY,         // Array value
    VALUE_OBJECT,        // Object value
    VALUE_NULL,          // Null value
    VALUE_ERROR          // Error value
} ValueType;
```

### Value

```c
typedef struct {
    ValueType type;      // Type of the value
    double number;       // Numeric value (if type == VALUE_NUMBER)
    char* string;        // String value (if type == VALUE_STRING)
    int boolean;         // Boolean value (if type == VALUE_BOOL)
    struct Value** array; // Array elements (if type == VALUE_ARRAY)
    int array_size;      // Array size
} Value;
```

### Value Creation Functions

```c
Value make_number(double value);
Value make_string(const char* value);
Value make_bool(int value);
Value make_null(void);
Value make_error(const char* message);
```

**Example:**
```c
Value num = make_number(42.0);
Value str = make_string("Hello");
Value boolean = make_bool(1);
Value null = make_null();
```

### Value Operations

```c
Value value_add(Value a, Value b);
Value value_subtract(Value a, Value b);
Value value_multiply(Value a, Value b);
Value value_divide(Value a, Value b);
int value_equals(Value a, Value b);
int value_less_than(Value a, Value b);
char* value_to_string(Value value);
```

**Example:**
```c
Value a = make_number(10);
Value b = make_number(5);
Value sum = value_add(a, b);  // sum.number == 15
```

### free_value

Frees memory allocated for a value.

```c
void free_value(Value* value);
```

---

## Memory Management

### Best Practices

1. **Always free tokens after use:**
```c
Token token = next_token(&lexer);
// Use token...
free_token(&token);
```

2. **Always free AST after interpretation:**
```c
ASTNode* ast = parse(input);
Value result = evaluate(&interpreter, ast);
free_ast(ast);
```

3. **Use Valgrind to check for leaks:**
```bash
valgrind --leak-check=full ./bin/droy examples/hello.droy
```

### Memory Safety Functions

```c
void* safe_malloc(size_t size);
void* safe_realloc(void* ptr, size_t size);
char* safe_strdup(const char* str);
```

These functions check for allocation failures and exit gracefully if memory cannot be allocated.

---

## Error Handling

### Error Codes

```c
typedef enum {
    ERROR_NONE,          // No error
    ERROR_SYNTAX,        // Syntax error
    ERROR_RUNTIME,       // Runtime error
    ERROR_TYPE,          // Type error
    ERROR_NAME,          // Undefined name
    ERROR_MEMORY,        // Memory allocation error
    ERROR_IO             // I/O error
} ErrorCode;
```

### Getting Error Information

```c
ErrorCode get_last_error(void);
const char* get_error_message(void);
void clear_error(void);
```

**Example:**
```c
Value result = interpret(&interpreter, "invalid syntax");
if (result.type == VALUE_ERROR) {
    printf("Error: %s\\n", get_error_message());
    clear_error();
}
```

---

## Example: Creating a Custom Extension

Here's a complete example of how to extend Droy with a custom function:

```c
#include "droy.h"

// Custom function implementation
Value custom_function(Interpreter* interp, int argc, Value* argv) {
    if (argc != 2) {
        return make_error("custom_function requires 2 arguments");
    }
    
    if (argv[0].type != VALUE_NUMBER || argv[1].type != VALUE_NUMBER) {
        return make_error("custom_function requires numeric arguments");
    }
    
    double result = argv[0].number + argv[1].number;
    return make_number(result);
}

// Register the function
void register_custom_functions(Interpreter* interp) {
    register_function(interp, "custom_add", custom_function);
}

// Main usage
int main() {
    Interpreter interpreter;
    init_interpreter(&interpreter);
    register_custom_functions(&interpreter);
    
    Value result = interpret(&interpreter, "custom_add(5, 3)");
    // result.number == 8
    
    return 0;
}
```

---

## See Also

- [README.md](../README.md) - General project documentation
- [CONTRIBUTING.md](../CONTRIBUTING.md) - Contribution guidelines
- [examples/](../examples/) - Example Droy programs
