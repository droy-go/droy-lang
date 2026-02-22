# Droy Programming Language

<p align="center">
  <img src="docs/logo.png" alt="Droy Logo" width="200"/>
</p>

<p align="center">
  <b>A Modern Markup and Programming Language with Package Management</b>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/version-2.0.0-blue.svg" alt="Version"/>
  <img src="https://img.shields.io/badge/license-MIT-green.svg" alt="License"/>
  <img src="https://img.shields.io/badge/language-C-orange.svg" alt="Language"/>
</p>

---

## 🚀 Features

- **📝 Rich Syntax** - Variables, operators, control flow, functions, and more
- **🔧 Package Manager** - Built-in package management with registry support
- **⚡ Fast Execution** - Optimized interpreter with LLVM backend support
- **🔗 Module System** - Import/export functionality for code organization
- **📦 Built-in Functions** - 50+ utility functions for common tasks
- **🌐 Network Support** - HTTP requests and URL handling
- **📁 File I/O** - Comprehensive file system operations
- **🧪 Testing Framework** - Built-in test runner
- **🎨 Code Formatting** - Automatic code formatting and linting

---

## 📥 Installation

### From Source

```bash
git clone https://github.com/droy-go/droy-lang.git
cd droy-lang
make
sudo make install
```

### Using Package Manager

```bash
# Coming soon
curl -fsSL https://droy-lang.org/install.sh | bash
```

---

## 🎯 Quick Start

### Hello World

Create a file `hello.droy`:

```droy
pkg "hello"

~s @si = "Hello, World!"
em @si
```

Run it:

```bash
droy run hello.droy
```

### Variables and Types

```droy
// Numbers
~s x = 42
~s pi = 3.14159

// Strings
~s name = "Droy"
~s greeting = "Hello, " + name + "!"

// Booleans
~s is_active = true

// Arrays
~s numbers = [1, 2, 3, 4, 5]
~s mixed = [1, "two", 3.0, true]

// Objects
~s person = {
    name: "John",
    age: 30,
    active: true
}
```

### Functions

```droy
f greet(name) {
    ret "Hello, " + name + "!"
}

em greet("World")  // Hello, World!

// Arrow-style functions
f add(a, b) {
    ret a + b
}

em add(5, 3)  // 8
```

### Control Flow

```droy
// If statements
fe (x > 10) {
    em "x is greater than 10"
} else {
    em "x is 10 or less"
}

// For loops
for (~s i = 0; i < 5; i = i + 1) {
    em "Iteration: " + i
}

// While loops
~s count = 0
while (count < 5) {
    em "Count: " + count
    count = count + 1
}

// For-in loops
for (item in numbers) {
    em item
}
```

### Package Management

```bash
# Initialize a new package
droy init my-package
cd my-package

# Install dependencies
droy install http
droy install json

# Install from GitHub
droy install github.com/user/repo

# Update packages
droy update

# Publish your package
droy publish
```

---

## 📚 Language Reference

### Keywords

| Keyword | Description |
|---------|-------------|
| `set`, `~s` | Variable declaration |
| `ret`, `~r` | Return statement |
| `em`, `~e` | Emit/output expression |
| `text`, `print` | Print with newline |
| `fe` | If condition |
| `else` | Else branch |
| `f` | Function definition |
| `for` | For loop |
| `while` | While loop |
| `break` | Break loop |
| `continue` | Continue loop |
| `pkg` | Package declaration |
| `import`, `use` | Import module |
| `export` | Export declaration |
| `link` | Create link |

### Operators

| Operator | Description |
|----------|-------------|
| `+` | Addition / String concatenation |
| `-` | Subtraction |
| `*` | Multiplication |
| `/` | Division |
| `%` | Modulo |
| `**` | Power |
| `==` | Equal |
| `!=` | Not equal |
| `<`, `>` | Less than, Greater than |
| `<=`, `>=` | Less than or equal, Greater than or equal |
| `and`, `&&` | Logical AND |
| `or`, `\|\|` | Logical OR |
| `not`, `!` | Logical NOT |

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

---

## 🛠️ Built-in Functions

### I/O Functions

- `print(...)` - Print values
- `println(...)` - Print values with newline
- `input(prompt)` - Read user input

### Type Functions

- `type(value)` - Get type of value
- `len(value)` - Get length of string/array/object

### Array Functions

- `push(array, ...items)` - Add items to end
- `pop(array)` - Remove and return last item
- `shift(array)` - Remove and return first item
- `unshift(array, ...items)` - Add items to beginning
- `slice(array, start, end)` - Get array slice

### String Functions

- `split(string, delimiter)` - Split string
- `join(array, delimiter)` - Join array elements
- `replace(string, search, replace)` - Replace substring
- `contains(string, substring)` - Check if contains
- `index_of(string, substring)` - Find index

### Math Functions

- `random()` - Random number 0-1
- `floor(n)`, `ceil(n)`, `round(n)` - Rounding
- `abs(n)` - Absolute value
- `sqrt(n)` - Square root
- `pow(base, exp)` - Power
- `min(...)`, `max(...)` - Min/max values
- `range(start, end, step)` - Generate range

### File Functions

- `read_file(path)` - Read file contents
- `write_file(path, content)` - Write file
- `append_file(path, content)` - Append to file
- `delete_file(path)` - Delete file
- `exists(path)` - Check if exists
- `is_file(path)`, `is_dir(path)` - Type check
- `mkdir(path)` - Create directory
- `rmdir(path)` - Remove directory
- `list_dir(path)` - List directory contents
- `chdir(path)` - Change directory
- `getcwd()` - Get current directory

### System Functions

- `getenv(name)` - Get environment variable
- `setenv(name, value)` - Set environment variable
- `exec(command)` - Execute shell command
- `exit(code)` - Exit program
- `sleep(seconds)` - Sleep
- `time()` - Get current time

### Network Functions

- `fetch(url, method, body)` - HTTP request
- `encode_url(string)` - URL encode
- `decode_url(string)` - URL decode

### Utility Functions

- `to_string(value)` - Convert to string
- `to_number(value)` - Convert to number
- `parse_json(string)` - Parse JSON
- `stringify_json(value)` - Convert to JSON
- `uuid()` - Generate UUID

---

## 📦 Package Manager

### Commands

```bash
droy init [path]           # Initialize new package
droy install [package]     # Install package
droy uninstall <package>   # Uninstall package
droy update [package]      # Update package(s)
droy search <query>        # Search packages
droy publish               # Publish package
droy list                  # List installed packages
droy info [package]        # Show package info
droy clean                 # Clean cache
```

### Configuration (droy.toml)

```toml
name = "my-package"
version = "1.0.0"
description = "A Droy package"
author = "Your Name"
license = "MIT"
droy_version = ">=2.0.0"
main = "src/main.droy"

[scripts]
build = "droy build"
test = "droy test"
run = "droy run"

[dependencies]
droy-http = "^1.0.0"
droy-json = "^2.0.0"
```

---

## 🔧 Development

### Building

```bash
make              # Build release version
make debug        # Build with debug symbols
make test         # Run tests
make clean        # Clean build files
```

### Project Structure

```
droy/
├── include/          # Header files
├── src/              # Source files
│   ├── lexer/        # Lexer
│   ├── parser/       # Parser
│   ├── interpreter/  # Interpreter
│   └── utils/        # Utilities
├── tests/            # Test files
├── docs/             # Documentation
├── examples/         # Example programs
├── bin/              # Compiled binaries
└── lib/              # Libraries
```

---

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- Inspired by modern programming languages
- Built with love for the developer community

---

<p align="center">
  <b>Droy Language</b> - Code with Power, Build with Style.
</p>

<p align="center">
  Made with ❤️ by the Droy Team
</p>
