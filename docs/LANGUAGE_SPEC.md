# Droy Language Specification

## Overview

Droy is a markup and programming language designed for simplicity and power. It combines the readability of markup languages with the expressiveness of programming languages.

## Lexical Structure

### Tokens

#### Keywords
- `set`, `~s` - Variable assignment
- `ret`, `~r` - Return statement
- `em`, `~e` - Expression emission
- `text`, `txt`, `t` - Text output
- `fe` - If condition
- `f` - Function definition
- `for` - For loop
- `sty` - Style block
- `pkg` - Package declaration
- `media` - Media element
- `link` - Link definition
- `a-link` - Anchor link
- `yoex--links` - Extended links
- `link-go` - Navigate link
- `create-link` - Create link
- `open-link` - Open link
- `api` - API endpoint
- `id` - Identifier
- `block` - Block definition
- `key` - Block key

#### Operators
- `+` - Addition / String concatenation
- `-` - Subtraction
- `*` - Multiplication
- `/` - Division
- `=` - Assignment

#### Special Variables
- `@si` - System Integer
- `@ui` - User Integer
- `@yui` - Dynamic Variable
- `@pop` - Pop Variable
- `@abc` - Alphabet Variable

#### Commands
- `*/employment` - Employment status command
- `*/Running` - Running state command
- `*/pressure` - Pressure level command
- `*/lock` - Lock command

### Literals

#### String Literals
Strings are enclosed in double or single quotes:
```droy
"Hello, World!"
'Single quoted string'
```

#### Number Literals
Numbers can be integers or floating-point:
```droy
42
3.14159
```

#### Comments
Single-line comments start with `//`:
```droy
// This is a comment
```

Multi-line comments use `/* */`:
```droy
/* This is a
   multi-line comment */
```

## Syntax

### Program Structure

A Droy program consists of a sequence of statements:
```droy
statement1
statement2
...
```

### Statements

#### Variable Declaration
```droy
set variable_name = value
~s variable_name = value
```

#### Return Statement
```droy
ret expression
~r expression
```

#### Emission Statement
```droy
em expression
~e expression
```

#### Text Statement
```droy
text expression
txt expression
t expression
```

### Expressions

#### Primary Expressions
- Literals: `"string"`, `42`, `3.14`
- Variables: `variable_name`, `@si`, `@ui`

#### Binary Expressions
```droy
expression + expression   // Addition / Concatenation
expression - expression   // Subtraction
expression * expression   // Multiplication
expression / expression   // Division
```

#### Assignment Expression
```droy
variable = expression
```

### Control Flow

#### For Loop
```droy
for variable in expression {
    statements
}
```

### Link System

#### Link Definition
```droy
link id: "identifier" api: "url"
```

#### Link Operations
```droy
create-link: "identifier"
open-link: "identifier"
link-go: "identifier"
```

### Block System

#### Block Definition
```droy
block: key(parameters) {
    statements
}
```

### Styling

#### Style Block
```droy
sty {
    set property = value
    statements
}
```

### Media

#### Media Element
```droy
media "url"
media id: "identifier" api: "url"
```

### Packages

#### Package Declaration
```droy
pkg "package-name"
```

## Semantics

### Variable Scope

Variables are dynamically scoped within their block context. Special variables (`@si`, `@ui`, etc.) have global scope.

### Type System

Droy uses dynamic typing:
- Numbers are stored as double-precision floating-point
- Strings are UTF-8 encoded
- Links are objects with `id`, `url`, `api`, and `is_open` properties

### Expression Evaluation

#### Arithmetic Operations
- Numbers are evaluated using floating-point arithmetic
- String concatenation with `+` operator

#### Variable Resolution
1. Check local scope
2. Check special variables
3. Return default value if not found

### Command Execution

Commands modify the interpreter state:
- `*/employment` - Sets employment status to active
- `*/Running` - Sets running state to true
- `*/pressure` - Increments pressure level
- `*/lock` - Sets locked state to true

## Examples

### Basic Program
```droy
// Set variables
set greeting = "Hello"
set name = "Droy"

// Output
text greeting + ", " + name + "!"

// Return
ret greeting + " " + name
```

### Math Operations
```droy
set x = 10
set y = 5

set sum = x + y
set diff = x - y
set prod = x * y
set quot = x / y

em "Results: " + sum + ", " + diff + ", " + prod + ", " + quot
```

### Link Management
```droy
// Define links
link id: "home" api: "https://example.com"
link id: "api" api: "https://api.example.com"

// Create and open
create-link: "home"
open-link: "home"
link-go: "home"

// Execute commands
*/employment
*/Running
*/lock
```

### Block Definition
```droy
block: key("main", "container") {
    set title = "Main Block"
    text title
    
    sty {
        set color = "blue"
        set font = "large"
        em "Styled: " + color + ", " + font
    }
}
```

## Implementation Details

### Lexer

The lexer tokenizes source code into a stream of tokens. It handles:
- Keywords and identifiers
- Operators and delimiters
- String and number literals
- Comments
- Special variables and commands

### Parser

The parser constructs an Abstract Syntax Tree (AST) from tokens. It implements:
- Recursive descent parsing
- Operator precedence
- Error recovery

### Interpreter

The interpreter executes the AST:
- Expression evaluation
- Variable management
- Link operations
- Command execution

### LLVM Backend

The LLVM backend compiles Droy to LLVM IR:
- Code generation
- Optimization
- Target-specific compilation

## Grammar (BNF)

```bnf
program ::= statement*

statement ::= set_stmt
            | ret_stmt
            | em_stmt
            | text_stmt
            | for_stmt
            | link_stmt
            | sty_stmt
            | pkg_stmt
            | media_stmt
            | block_stmt
            | command_stmt
            | expr_stmt

set_stmt ::= ("set" | "~s") identifier "=" expression

ret_stmt ::= ("ret" | "~r") expression

em_stmt ::= ("em" | "~e") expression

text_stmt ::= ("text" | "txt" | "t") expression

for_stmt ::= "for" identifier "in" expression block

link_stmt ::= "link" link_properties
            | "a-link" link_properties
            | "yoex--links" link_properties
            | "create-link" ":" string
            | "open-link" ":" string
            | "link-go" ":" string

link_properties ::= ("id" ":" string | "api" ":" string)*

sty_stmt ::= "sty" block

pkg_stmt ::= "pkg" expression

media_stmt ::= "media" (string | media_properties)

media_properties ::= ("id" ":" string | "api" ":" string)*

block_stmt ::= "block" ":" "key" "(" param_list ")" block

param_list ::= identifier ("," identifier)*

command_stmt ::= "*/employment"
               | "*/Running"
               | "*/pressure"
               | "*/lock"

block ::= "{" statement* "}"

expression ::= term (("+" | "-") term)*

term ::= factor (("*" | "/") factor)*

factor ::= ("+" | "-") factor
         | primary

primary ::= number
          | string
          | identifier
          | special_var
          | "(" expression ")"

special_var ::= "@si" | "@ui" | "@yui" | "@pop" | "@abc"

identifier ::= [a-zA-Z_][a-zA-Z0-9_-]*

number ::= [0-9]+ ("." [0-9]+)?

string ::= "\"" [^"]* "\""
         | "'" [^']* "'"
```

## Future Enhancements

- Type annotations
- Module system
- Exception handling
- Async/await
- Standard library
- Package manager
