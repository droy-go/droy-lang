# Droy Language Specification

## Overview

Droy is a modern markup and programming language designed for simplicity and power. It combines the ease of use of scripting languages with the performance of compiled languages.

## Syntax

### Comments

```droy
// Single-line comment

/*
 * Multi-line comment
 */
```

### Variables

```droy
// Using shorthand
~s name = "value"      // set
~r result             // return
~e expression         // emit

// Using keywords
set name = "value"
ret result
em expression
```

### Data Types

#### Numbers
```droy
~s integer = 42
~s floating = 3.14159
~s negative = -10
~s scientific = 1.5e10
```

#### Strings
```droy
~s single = 'hello'
~s double = "hello"
~s escaped = "line1\nline2"
~s interpolated = "Hello, ${name}!"
```

#### Booleans
```droy
~s flag = true
~s other = false
```

#### Null
```droy
~s nothing = null
```

#### Arrays
```droy
~s numbers = [1, 2, 3, 4, 5]
~s mixed = [1, "two", 3.0, true]
~s nested = [[1, 2], [3, 4]]
```

#### Objects
```droy
~s person = {
    name: "John",
    age: 30,
    active: true
}
```

### Operators

#### Arithmetic
```droy
+   // Addition
-   // Subtraction
*   // Multiplication
/   // Division
%   // Modulo
**  // Power
```

#### Comparison
```droy
==  // Equal
!=  // Not equal
<   // Less than
>   // Greater than
<=  // Less than or equal
>=  // Greater than or equal
```

#### Logical
```droy
and // Logical AND
or  // Logical OR
not // Logical NOT
```

#### Assignment
```droy
=   // Assign
+=  // Add and assign
-=  // Subtract and assign
*=  // Multiply and assign
/=  // Divide and assign
```

### Control Flow

#### If Statements
```droy
fe (condition) {
    // code
}

fe (condition) {
    // code
} else {
    // code
}

fe (condition1) {
    // code
} else fe (condition2) {
    // code
} else {
    // code
}
```

#### For Loops
```droy
// C-style
for (~s i = 0; i < 10; i = i + 1) {
    // code
}

// For-in
for (item in array) {
    // code
}
```

#### While Loops
```droy
while (condition) {
    // code
}
```

#### Break and Continue
```droy
break     // Exit loop
continue  // Skip to next iteration
```

### Functions

```droy
// Function definition
f name(param1, param2) {
    // code
    ret value
}

// Function call
name(arg1, arg2)

// Anonymous function
f (x) { ret x * 2 }
```

### Modules

```droy
// Package declaration
pkg "my-package"

// Import
import "module"
import "module" as alias
use "module"
require "module"

// Export
export name
export f name() { }
```

### Special Variables

| Variable | Description |
|----------|-------------|
| `@si` | System integer/string |
| `@ui` | User interface variable |
| `@yui` | Dynamic user input |
| `@pop` | Pop/stack variable |
| `@abc` | Alphabet/string buffer |
| `@argc` | Argument count |
| `@argv` | Argument vector |
| `@env` | Environment variables |

## Grammar

### EBNF

```ebnf
program         ::= statement*

statement       ::= variable_decl
                  | function_decl
                  | if_stmt
                  | for_stmt
                  | while_stmt
                  | break_stmt
                  | continue_stmt
                  | return_stmt
                  | expression_stmt
                  | block

variable_decl   ::= ("set" | "~s") identifier "=" expression

function_decl   ::= "f" identifier "(" params? ")" block

params          ::= identifier ("," identifier)*

if_stmt         ::= "fe" "(" expression ")" statement ("else" statement)?

for_stmt        ::= "for" "(" for_init? ";" expression? ";" for_update? ")" statement
                  | "for" "(" identifier "in" expression ")" statement

while_stmt      ::= "while" "(" expression ")" statement

break_stmt      ::= "break"

continue_stmt   ::= "continue"

return_stmt     ::= ("ret" | "~r") expression?

expression_stmt ::= expression

block           ::= "{" statement* "}"

expression      ::= assignment

assignment      ::= identifier "=" expression
                  | identifier ("+=" | "-=" | "*=" | "/=") expression

logical_or      ::= logical_and ("or" logical_and)*

logical_and     ::= equality ("and" equality)*

equality        ::= comparison (("==" | "!=") comparison)*

comparison      ::= term (("<" | ">" | "<=" | ">=") term)*

term            ::= factor (("+" | "-") factor)*

factor          ::= unary (("*" | "/" | "%") unary)*

unary           ::= ("-" | "not") unary
                  | power

power           ::= primary ("**" unary)?

primary         ::= number
                  | string
                  | boolean
                  | null
                  | identifier
                  | "(" expression ")"
                  | array_literal
                  | object_literal
                  | function_call
                  | member_access
                  | index_access

array_literal   ::= "[" (expression ("," expression)*)? "]"

object_literal  ::= "{" (pair ("," pair)*)? "}"

pair            ::= (identifier | string) ":" expression

function_call   ::= identifier "(" arguments? ")"

arguments       ::= expression ("," expression)*

member_access   ::= primary "." identifier

index_access    ::= primary "[" expression "]"

identifier      ::= [a-zA-Z_][a-zA-Z0-9_]*
number          ::= [0-9]+ ("." [0-9]+)? ([eE] [+-]? [0-9]+)?
string          ::= '"' [^"]* '"' | "'" [^']* "'"
boolean         ::= "true" | "false"
null            ::= "null"
```

## Built-in Functions

See [BUILTINS.md](BUILTINS.md) for complete list.

## Standard Library

See [STDLIB.md](STDLIB.md) for standard library documentation.
