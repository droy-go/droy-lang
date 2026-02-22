# Contributing to Droy Language

Thank you for your interest in contributing to the Droy Helper Language! This document provides guidelines and instructions for contributing to the project.

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [How to Contribute](#how-to-contribute)
- [Development Setup](#development-setup)
- [Coding Standards](#coding-standards)
- [Submitting Changes](#submitting-changes)
- [Community](#community)

## 📜 Code of Conduct

This project and everyone participating in it is governed by our [Code of Conduct](CODE_OF_CONDUCT.md). By participating, you are expected to uphold this code.

## 🚀 Getting Started

### Prerequisites

- **Operating System**: Linux, macOS, or Windows
- **Compiler**: GCC 11+, Clang 14+, or MSVC 2022+
- **CMake**: 3.16 or higher
- **LLVM**: 14+ (optional, for LLVM backend)
- **Git**: 2.30 or higher

### Fork and Clone

1. Fork the repository on GitHub
2. Clone your fork locally:
   ```bash
   git clone https://github.com/YOUR_USERNAME/droy-lang.git
   cd droy-lang
   ```
3. Add the upstream repository:
   ```bash
   git remote add upstream https://github.com/droy-go/droy-lang.git
   ```

## 💡 How to Contribute

### Reporting Bugs

Before creating a bug report, please:

1. Check the [existing issues](https://github.com/droy-go/droy-lang/issues) to avoid duplicates
2. Use the latest version of Droy
3. Collect information about the bug (OS, compiler, error messages)

When reporting bugs, use our [Bug Report Template](https://github.com/droy-go/droy-lang/issues/new?template=bug_report.yml) and include:

- Clear description of the bug
- Steps to reproduce
- Expected vs actual behavior
- Environment details
- Code sample (if applicable)

### Suggesting Features

We welcome feature suggestions! Please:

1. Check if the feature has already been requested
2. Use our [Feature Request Template](https://github.com/droy-go/droy-lang/issues/new?template=feature_request.yml)
3. Explain the use case and benefits
4. Consider providing a prototype implementation

### Contributing Code

#### Finding Issues to Work On

- Look for issues labeled [`good first issue`](https://github.com/droy-go/droy-lang/labels/good%20first%20issue) or [`help wanted`](https://github.com/droy-go/droy-lang/labels/help%20wanted)
- Comment on the issue to let others know you're working on it
- Ask questions if anything is unclear

#### Development Workflow

1. **Create a branch**:
   ```bash
   git checkout -b feature/your-feature-name
   # or
   git checkout -b fix/issue-description
   ```

2. **Make your changes**:
   - Write clean, documented code
   - Follow our coding standards
   - Add tests for new functionality

3. **Test your changes**:
   ```bash
   make clean
   make
   make test
   make lint  # Check code style
   ```

4. **Commit your changes**:
   ```bash
   git add .
   git commit -m "type: description"
   ```
   Follow our [commit message conventions](#commit-message-conventions).

5. **Push to your fork**:
   ```bash
   git push origin feature/your-feature-name
   ```

6. **Create a Pull Request**:
   - Use our PR template
   - Link related issues
   - Ensure CI checks pass

## 🛠️ Development Setup

### Building from Source

```bash
# Clone the repository
git clone https://github.com/droy-go/droy-lang.git
cd droy-lang

# Build with Make
make

# Or build with CMake
mkdir build && cd build
cmake ..
make

# Run tests
make test
```

### IDE Setup

#### VS Code

Recommended extensions:
- C/C++ (Microsoft)
- CMake Tools
- clangd
- CodeLLDB

#### CLion

Open the project directly. CLion will automatically detect the CMake configuration.

## 📝 Coding Standards

### C++ Style Guide

We follow a modified LLVM style with these key points:

- **Indentation**: 4 spaces (no tabs)
- **Line Length**: 100 characters maximum
- **Naming**:
  - Classes: `PascalCase`
  - Functions: `camelCase`
  - Variables: `snake_case`
  - Constants: `UPPER_SNAKE_CASE`
  - Private members: trailing underscore (`member_`)

### Code Formatting

Format your code before committing:

```bash
make format
```

Or manually with clang-format:

```bash
clang-format -i src/your_file.cpp
```

### Static Analysis

Run static analysis checks:

```bash
make lint
```

### Documentation

- Document all public APIs with Doxygen-style comments
- Keep comments clear and concise
- Update documentation when changing behavior

Example:
```cpp
/**
 * @brief Tokenizes the input source code
 * @param source The source code string to tokenize
 * @return Vector of tokens
 * @throws LexerError if invalid token encountered
 */
std::vector<Token> tokenize(const std::string& source);
```

### Commit Message Conventions

Format: `type(scope): description`

Types:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, no logic change)
- `refactor`: Code refactoring
- `perf`: Performance improvements
- `test`: Adding or updating tests
- `chore`: Build process or auxiliary tool changes

Examples:
```
feat(lexer): add support for multiline strings
fix(parser): correct precedence for bitwise operators
docs(readme): update installation instructions
```

## 📤 Submitting Changes

### Pull Request Process

1. **Update documentation** if needed
2. **Add tests** for new functionality
3. **Ensure all tests pass**
4. **Update the CHANGELOG.md** with your changes
5. **Fill out the PR template** completely
6. **Request review** from maintainers

### PR Review Process

- Maintainers will review your PR within a few days
- Address review comments promptly
- Be open to feedback and suggestions
- Once approved, a maintainer will merge your PR

### After Your PR is Merged

- Your contribution will be acknowledged in the release notes
- Thank you for helping make Droy better! 🎉

## 🌐 Community

### Getting Help

- **GitHub Discussions**: [Ask questions](https://github.com/droy-go/droy-lang/discussions)
- **Issues**: [Report bugs or request features](https://github.com/droy-go/droy-lang/issues)
- **Documentation**: [Read the docs](https://droy-go.github.io/droy-lang/)

### Communication Channels

- Be respectful and constructive
- Help others when you can
- Share your experiences and use cases

## 📜 License

By contributing to Droy Language, you agree that your contributions will be licensed under the [MIT License](LICENSE).

## 🙏 Recognition

Contributors will be:
- Listed in the [CONTRIBUTORS](CONTRIBUTORS.md) file
- Mentioned in release notes
- Acknowledged in the project documentation

---

**Thank you for contributing to Droy Language!** Your efforts help make this project better for everyone.
