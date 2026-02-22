# Changelog

All notable changes to the Droy Language project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Initial project setup with CMake and Makefile build systems
- Comprehensive CI/CD pipeline with GitHub Actions
- Code quality tools (clang-format, clang-tidy, cppcheck)
- Security scanning with CodeQL
- Documentation deployment to GitHub Pages

### Changed
- N/A

### Deprecated
- N/A

### Removed
- N/A

### Fixed
- N/A

### Security
- N/A

---

## [1.0.0] - 2026-02-22

### Added
- 🎉 **Initial Release** of Droy Helper Language
- **Lexer**: Complete lexical analyzer with support for:
  - Keywords (set, em, if, else, while, fn, etc.)
  - Operators (+, -, *, /, =, ==, !=, <, >, <=, >=)
  - Identifiers and literals
  - Comments (single-line and multi-line)
  - String and numeric literals
  
- **Parser**: Recursive descent parser implementing:
  - Variable declarations
  - Expressions with proper precedence
  - Control flow (if/else, while loops)
  - Function definitions and calls
  - Block statements
  
- **AST**: Abstract Syntax Tree representation with:
  - Node types for all language constructs
  - Visitor pattern support
  - Pretty printing capabilities
  
- **Interpreter**: Tree-walking interpreter supporting:
  - Variable assignment and retrieval
  - Arithmetic operations
  - Comparison operations
  - Control flow execution
  - Function calls
  
- **LLVM Backend**: Code generation using LLVM:
  - IR generation for all AST nodes
  - JIT compilation support
  - Optimization passes
  - Target code generation (x86)
  
- **Standard Library**: Basic built-in functions:
  - `em()` - Output function
  - `input()` - Input function
  - Type conversion functions
  
- **Build System**:
  - CMake 3.16+ support
  - Makefile with multiple targets
  - Cross-platform support (Linux, macOS, Windows)
  
- **Testing Framework**:
  - Unit tests for lexer
  - Unit tests for parser
  - Integration tests
  - Example programs
  
- **Documentation**:
  - README with quick start guide
  - Language reference
  - API documentation
  - Contributing guidelines
  
- **Examples**:
  - Hello World
  - Variables and arithmetic
  - Control flow
  - Functions
  - Fibonacci sequence
  - Factorial calculation

### Features

#### Language Features
- **Variables**: Dynamic typing with `set` keyword
- **Functions**: First-class functions with `fn` keyword
- **Control Flow**: `if`/`else` conditionals, `while` loops
- **Operators**: Arithmetic, comparison, and logical operators
- **Comments**: Single-line (`//`) and multi-line (`/* */`)

#### Compiler Features
- **Error Reporting**: Clear error messages with line numbers
- **Optimization**: LLVM optimization passes
- **Debug Info**: Debug symbol generation
- **Cross-Compilation**: Support for multiple targets

### Known Issues
- Memory leaks in some edge cases (being investigated)
- Limited standard library
- No module/import system yet
- Windows support is experimental

---

## Version History

### Pre-release Versions

#### [0.9.0] - 2026-02-15
- Beta release with core functionality
- Basic lexer and parser
- Simple interpreter

#### [0.8.0] - 2026-02-01
- Alpha release
- Initial lexer implementation
- Token definitions

#### [0.1.0] - 2026-01-15
- Project initialization
- Repository setup
- Basic project structure

---

## Release Notes Format

Each release includes:

- **Added**: New features
- **Changed**: Changes to existing functionality
- **Deprecated**: Soon-to-be removed features
- **Removed**: Removed features
- **Fixed**: Bug fixes
- **Security**: Security-related changes

---

## Upcoming Features

### Planned for v1.1.0
- [ ] Module system with `import` keyword
- [ ] Extended standard library
- [ ] Better error messages with suggestions
- [ ] REPL (Read-Eval-Print Loop)
- [ ] Package manager

### Planned for v1.2.0
- [ ] Struct/record types
- [ ] Arrays and lists
- [ ] String manipulation functions
- [ ] File I/O operations

### Planned for v2.0.0
- [ ] Static type system (optional)
- [ ] Generics
- [ ] Closures
- [ ] Async/await support

---

## How to Update

### From Source
```bash
git pull origin main
make clean
make
```

### Using CMake
```bash
git pull origin main
rm -rf build
mkdir build && cd build
cmake ..
make
```

---

## Contributors

See [CONTRIBUTORS.md](CONTRIBUTORS.md) for a list of contributors to each release.

---

**Full Changelog**: https://github.com/droy-go/droy-lang/compare/v0.9.0...v1.0.0
