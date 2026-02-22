 
<p align="center">
  <img src="https://raw.githubusercontent.com/droy-go/droy-lang/main/docs/logo.png" alt="Droy Logo" width="200"/>
</p>

<h1 align="center">⚡ Droy Programming Language</h1>

<p align="center">
  <b>A complete markup and programming language built from scratch in C with LLVM backend support</b>
</p>

<p align="center">
  <a href="#features">Features</a> •
  <a href="#installation">Installation</a> •
  <a href="#quick-start">Quick Start</a> •
  <a href="#language-syntax">Language Syntax</a> •
  <a href="#examples">Examples</a> •
  <a href="#contributing">Contributing</a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/version-1.0.0-blue.svg" alt="Version"/>
  <img src="https://img.shields.io/badge/license-MIT-green.svg" alt="License"/>
  <img src="https://img.shields.io/badge/backend-LLVM-orange.svg" alt="LLVM"/>
  <img src="https://img.shields.io/badge/editor-Web--IDE-purple.svg" alt="Web IDE"/>
</p>

---

## 🚀 Features

- **🛠️ Complete Language Implementation**: Full-featured Lexer, Parser, AST, and Interpreter
- **📝 Rich Syntax**: Variables, operators, control flow, links, styling, and more
- **⚙️ LLVM Backend**: Compile Droy code to high-performance LLVM IR
- **💻 Professional Code Editor**: Web-based IDE with syntax highlighting and auto-completion
- **🔧 Special Variables**: Built-in system variables (`@si`, `@ui`, `@yui`, `@pop`, `@abc`)
- **🎮 Command System**: Powerful commands (`*/employment`, `*/Running`, `*/pressure`, `*/lock`)
- **🔗 Link Management**: Create, open, and navigate links seamlessly
- **📦 Block System**: Define reusable code blocks with scoping

---

## 📥 Installation

### Prerequisites

- **C Compiler** (GCC or Clang)
- **LLVM** (optional, for LLVM backend)
- **Make**

### Building from Source

```bash
# Clone the repository
git clone https://github.com/droy-go/droy-lang.git
cd droy-lang

# Build the compiler
make

# Verify installation
./bin/droy -v
```

### Building LLVM Backend

```bash
# Requires LLVM installed
make llvm
```

---

## 🎯 Quick Start

### Hello World

Create a file `hello.droy`:

```droy
~s @si = "Hello"
~s @ui = "World"
em @si + " " + @ui + "!"
```

Run it:

```bash
./bin/droy hello.droy
```

### Using the Web IDE

Open `editor/index.html` in your browser for a professional development experience with:
- Syntax highlighting
- Auto-completion
- Error detection
- Live preview

---

## 📚 Language Syntax

### Variables & Data Types

```droy
// Standard variable declaration
set name = "Droy"
set version = "1.0.0"
set count = 42

// Shorthand syntax (~s = set)
~s @si = 100
~s @ui = 200
~s @yui = "Dynamic"

// Special system variables
@si = "System Integer"
@ui = "User Interface"
@yui = "Your User Input"
@pop = "Pop Value"
@abc = "Alphabet"
```

### Output & Emission

```droy
// Output text
text "Hello, World!"
txt @si

// Emit expressions (shorthand: ~e)
em @si + " " + @ui
~e "Sum: " + (10 + 20)

// Return values (shorthand: ~r)
ret @si + " " + @ui + @yui
~r "Completed"
```

### Mathematical Operations

```droy
set a = 10
set b = 5

set sum = a + b        // Addition
set diff = a - b       // Subtraction
set product = a * b    // Multiplication
set quotient = a / b   // Division

em "Results:"
em "Sum: " + sum
em "Difference: " + diff
```

### Control Flow

```droy
// If statements (fe = if)
fe (a > b) {
    em "a is greater"
}

// For loops
for (set i = 0; i < 10; i = i + 1) {
    em "Iteration: " + i
}

// Functions (f = function)
f greet(name) {
    ret "Hello, " + name
}

em greet("Droy")
```

### Link System

```droy
// Create a link
link id: "homepage" api: "https://example.com"
create-link: "homepage"

// Open links
open-link: "homepage"
link-go: "homepage"

// Extended links
yoex--links id: "external" api: "https://external.com"
```

### Styling Blocks

```droy
sty {
    set color = "blue"
    set font = "Arial"
    em "Styled content"
}
```

### Commands

```droy
*/employment    // Activate employment status
*/Running       // Start system execution
*/pressure      // Increase pressure level
*/lock          // Lock system state
```

### Blocks

```droy
block: key("main") {
    set title = "Main Block"
    text title
    
    sty {
        set color = "blue"
        em "Nested styling"
    }
}
```

---

## 🛠️ Compiler Options

```bash
# Show help
./bin/droy -h

# Show version
./bin/droy -v

# Print tokens (lexical analysis)
./bin/droy -t file.droy

# Print AST (Abstract Syntax Tree)
./bin/droy -a file.droy

# Compile to LLVM IR
./bin/droy -c -o output.ll file.droy

# Interactive REPL mode
./bin/droy -i
```

---

## ⚙️ LLVM Backend Usage

```bash
# Compile Droy to LLVM IR
./bin/droy-llvm input.droy output.ll

# Compile LLVM IR to assembly
llc output.ll -o output.s

# Create executable
clang output.s -o output

# Run
./output
```

---

## 📂 Project Structure

```
droy-lang/
├── include/
│   └── droy.h              # Core header definitions
├── src/
│   ├── lexer.c             # Lexical analyzer (Tokenizer)
│   ├── parser.c            # Parser & AST generator
│   ├── interpreter.c       # Interpreter engine
│   └── main.c              # CLI entry point
├── editor/
│   ├── index.html          # Web-based IDE
│   ├── editor.css          # Editor styles
│   ├── editor.js           # Editor logic
│   └── droy-mode.js        # CodeMirror mode for Droy
├── llvm/
│   └── droy_backend.cpp    # LLVM backend implementation
├── examples/
│   ├── hello.droy          # Hello World example
│   ├── variables.droy      # Variables demo
│   ├── math.droy           # Math operations
│   ├── links.droy          # Link system demo
│   └── blocks.droy         # Blocks & styling
├── Makefile                # Build configuration
└── README.md               # This file
```

---

## 📖 Language Reference

### Keywords

| Keyword | Shorthand | Description |
|---------|-----------|-------------|
| `set` | `~s` | Variable assignment |
| `ret` | `~r` | Return statement |
| `em` | `~e` | Emit/output expression |
| `text` | `txt`, `t` | Output text |
| `fe` | - | If condition |
| `f` | - | Function declaration |
| `for` | - | For loop |
| `sty` | - | Style block |
| `pkg` | - | Package declaration |
| `media` | - | Media element |
| `link` | - | Create link |
| `a-link` | - | Anchor link |
| `yoex--links` | - | Extended links |

### Operators

| Operator | Description |
|----------|-------------|
| `+` | Addition / String concatenation |
| `-` | Subtraction |
| `*` | Multiplication |
| `/` | Division |
| `=` | Assignment |
| `>` | Greater than |
| `<` | Less than |
| `==` | Equal to |

### Special Variables

| Variable | Purpose |
|----------|---------|
| `@si` | System Integer / String |
| `@ui` | User Interface variable |
| `@yui` | Dynamic user input |
| `@pop` | Pop/Stack variable |
| `@abc` | Alphabet/String buffer |

---

## 💡 Examples

### Calculator Program

```droy
// Calculator.droy
set a = 10
set b = 5

set sum = a + b
set diff = a - b
set prod = a * b
set quot = a / b

em "=== Calculator Results ==="
em "Sum: " + sum
em "Difference: " + diff
em "Product: " + prod
em "Quotient: " + quot
```

### Link Manager

```droy
// links.droy
link id: "google" api: "https://google.com"
link id: "github" api: "https://github.com"
link id: "docs" api: "https://docs.droy-lang.org"

create-link: "google"
create-link: "github"

em "Opening Google..."
open-link: "google"

*/Running
```

### Function Example

```droy
// functions.droy
f calculate(x, y, operation) {
    fe (operation == "add") {
        ret x + y
    }
    fe (operation == "subtract") {
        ret x - y
    }
    fe (operation == "multiply") {
        ret x * y
    }
    ret "Unknown operation"
}

em calculate(10, 5, "add")
em calculate(10, 5, "multiply")
```

---

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details on our code of conduct.

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- **LLVM Project** - For the powerful backend infrastructure
- **CodeMirror** - For the excellent web-based editor component
- **C Community** - For the robust systems programming foundation

---

<p align="center">
  <b>🚀 Droy Language</b> - Code with Power, Build with Style.
</p>

<p align="center">
  Made with ❤️ by the Droy Team
</p>