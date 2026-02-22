# Droy Language - Build System Documentation

This directory contains a comprehensive build system for the Droy Helper Language compiler, including CMake configuration, Makefile, and CI/CD workflows.

## 📁 Files Overview

| File | Description |
|------|-------------|
| `CMakeLists.txt` | Modern CMake build configuration with LLVM support |
| `Makefile` | Comprehensive Makefile with multiple build targets |
| `.github/workflows/ci.yml` | Main CI pipeline for building and testing |
| `.github/workflows/release.yml` | Automated release workflow |
| `.github/workflows/codeql.yml` | Security analysis with CodeQL |
| `.github/workflows/docs.yml` | Documentation deployment to GitHub Pages |
| `.github/workflows/lint.yml` | Code quality and formatting checks |
| `.github/workflows/dependency-update.yml` | Dependency update automation |
| `.github/dependabot.yml` | Dependabot configuration |
| `.github/renovate.json` | Renovate configuration for dependency updates |

## 🚀 Quick Start

### Using Make (Recommended for Development)

```bash
# Build the compiler (default: release)
make

# Build with debug symbols
make debug

# Build optimized release version
make release

# Run all tests
make test

# Run specific tests
make test-lexer
make test-parser

# Run example programs
make examples

# Install to system
sudo make install

# Show all available targets
make help
```

### Using CMake (Recommended for IDE Integration)

```bash
# Configure
mkdir build && cd build
cmake .. -DCMAKE_BUILD_TYPE=Release

# Build
cmake --build . --parallel

# Run tests
ctest --output-on-failure

# Install
sudo cmake --install .
```

## 🔧 Build Options

### CMake Options

| Option | Default | Description |
|--------|---------|-------------|
| `BUILD_TESTS` | ON | Build test suite |
| `BUILD_EXAMPLES` | ON | Build example programs |
| `BUILD_DOCS` | OFF | Build documentation |
| `ENABLE_LLVM` | ON | Enable LLVM backend |
| `ENABLE_WERROR` | OFF | Treat warnings as errors |
| `ENABLE_SANITIZERS` | OFF | Enable AddressSanitizer and UBSan |
| `ENABLE_COVERAGE` | OFF | Enable code coverage reporting |

### Makefile Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `CXX` | clang++ | C++ compiler |
| `CC` | clang | C compiler |
| `LLVM_CONFIG` | llvm-config | LLVM config tool path |
| `BUILD_TYPE` | release | Build type (debug/release/profile) |
| `PREFIX` | /usr/local | Installation prefix |

## 📋 Build Examples

### Debug Build with Sanitizers

```bash
# Using CMake
cmake -B build -DCMAKE_BUILD_TYPE=Debug -DENABLE_SANITIZERS=ON
cmake --build build

# Using Make
make BUILD_TYPE=debug
```

### Release Build with Coverage

```bash
# Using CMake
cmake -B build -DCMAKE_BUILD_TYPE=Debug -DENABLE_COVERAGE=ON
cmake --build build
cd build && ctest

# Generate coverage report
lcov --capture --directory . --output-file coverage.info
lcov --remove coverage.info '/usr/*' --output-file coverage.info
genhtml coverage.info --output-directory coverage-report
```

### Cross-Platform Build

```bash
# Linux with GCC
cmake -B build -DCMAKE_C_COMPILER=gcc -DCMAKE_CXX_COMPILER=g++

# macOS with Homebrew LLVM
export LLVM_DIR=$(brew --prefix llvm)/lib/cmake/llvm
cmake -B build -DLLVM_DIR=$LLVM_DIR

# Windows with MSVC
cmake -B build -G "Visual Studio 17 2022"
cmake --build build --config Release
```

## 🧪 Testing

### Run All Tests

```bash
make test
# or
cd build && ctest --output-on-failure
```

### Run Specific Test Suites

```bash
make test-lexer
make test-parser
```

### Run with Valgrind

```bash
valgrind --leak-check=full ./build/bin/droy-test lexer
```

## 📊 Code Quality

### Format Code

```bash
make format
```

### Run Static Analysis

```bash
make lint
```

### Run All Checks

```bash
make check
```

## 🌐 CI/CD Workflows

### Main CI Pipeline (`ci.yml`)

Runs on every push and pull request:
- Builds on Ubuntu (GCC/Clang), macOS, and Windows
- Runs all tests
- Performs code quality checks
- Memory leak detection with Valgrind
- Sanitizer checks
- Code coverage reporting

### Release Pipeline (`release.yml`)

Triggered on version tags (`v*`):
- Builds release binaries for Linux, macOS, and Windows
- Generates release notes
- Creates GitHub release with artifacts
- Generates checksums

### Security Analysis (`codeql.yml`)

Runs on schedule and on PRs:
- CodeQL analysis for C/C++
- JavaScript analysis (if applicable)
- Dependency review
- Secret scanning

### Documentation (`docs.yml`)

Builds and deploys documentation:
- Generates Doxygen API docs
- Builds MkDocs site
- Deploys to GitHub Pages

### Linting (`lint.yml`)

Code quality checks:
- Clang-format verification
- Clang-tidy analysis
- Cppcheck static analysis
- Include-What-You-Use checks

## 🔒 Security

### CodeQL Analysis

The project uses GitHub CodeQL for security analysis. Results are available in the Security tab of the repository.

### Secret Scanning

TruffleHog is used to detect secrets in the codebase. The workflow runs on every push and PR.

### Dependency Review

Dependabot and Renovate are configured to automatically update dependencies and alert on security vulnerabilities.

## 📦 Packaging

### Create Distribution Archive

```bash
make dist
```

This creates a tarball in the `dist/` directory with all necessary files for distribution.

## 🛠️ Troubleshooting

### LLVM Not Found

If CMake cannot find LLVM:

```bash
# Specify LLVM directory
cmake -B build -DLLVM_DIR=/usr/lib/llvm-17/lib/cmake/llvm

# Or use llvm-config
export LLVM_CONFIG=/usr/bin/llvm-config-17
make
```

### Missing Dependencies on Ubuntu

```bash
sudo apt-get update
sudo apt-get install -y build-essential llvm llvm-dev cmake make
```

### Missing Dependencies on macOS

```bash
brew install llvm cmake
brew link llvm --force
```

### Windows Build Issues

Ensure you have:
- Visual Studio 2022 with C++ workload
- CMake 3.16+
- LLVM Windows binaries (optional)

## 📚 Additional Resources

- [CMake Documentation](https://cmake.org/documentation/)
- [LLVM CMake Guide](https://llvm.org/docs/CMake.html)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [CodeQL Documentation](https://docs.github.com/en/code-security/code-scanning)

## 🤝 Contributing

When contributing, please ensure:
1. Code follows the project's formatting style (`make format`)
2. All tests pass (`make test`)
3. Static analysis passes (`make lint`)
4. CI pipeline succeeds

## 📄 License

This build system is part of the Droy Helper Language project and follows the same license terms.
