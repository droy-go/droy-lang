# Droy Code Editor

A powerful terminal-based code editor for the **Droy Programming Language**, built with C and ncurses.

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)
![Language](https://img.shields.io/badge/language-C-orange.svg)

## Features

- **Vim-like Key Bindings** - Familiar navigation and editing commands
- **Syntax Highlighting** - Full support for Droy language keywords, variables, and operators
- **Multi-File Editing** - Work with multiple buffers simultaneously
- **File Explorer Sidebar** - Navigate your project structure
- **Search & Replace** - Find and replace with regex support
- **Auto-Indentation** - Smart indentation based on code structure
- **Line Numbers** - Optional line number display
- **Command Mode** - Execute commands with `:` prefix
- **Lightweight** - Fast and efficient terminal-based interface

## Screenshots

```
┌─────────────────────────────────────────────────────────────────┐
│ ◈ Droy Editor                              v1.0.0    [NORMAL]  │
├──────────┬──────────────────────────────────────────────────────┤
│ EXPLORER │ 1 │ // Droy Language Example                         │
│          │ 2 │ ~s @si = "Hello World"                           │
│ examples │ 3 │ set @ui = "!"                                    │
│   hello  │ 4 │ text @si                                         │
│   var    │ 5 │ em @si + @ui                                     │
│   math   │ 6 │ ret @si                                          │
│          │ 7 │                                                  │
├──────────┴──────────────────────────────────────────────────────┤
│ [+] hello.droy | Line 2/6 | Col 15 | -- INSERT --               │
└─────────────────────────────────────────────────────────────────┘
```

## Installation

### Prerequisites

- GCC compiler
- ncurses library
- Make

### Install Dependencies

**Ubuntu/Debian:**
```bash
sudo apt-get install build-essential libncurses5-dev
```

**Fedora/RHEL:**
```bash
sudo dnf install gcc ncurses-devel make
```

**macOS:**
```bash
brew install ncurses
```

### Build from Source

```bash
# Clone the repository
git clone https://github.com/droy-go/droy-lang.git
cd droy-lang/c-editor

# Build the editor
make

# Or build with debug symbols
make debug
```

### Install System-Wide

```bash
sudo make install
```

This will install `droy-editor` to `/usr/local/bin`.

## Usage

### Starting the Editor

```bash
# Open with empty buffer
droy-editor

# Open a specific file
droy-editor myfile.droy

# Show help
droy-editor --help

# Show version
droy-editor --version
```

### Key Bindings

#### Normal Mode

| Key | Action |
|-----|--------|
| `h`, `j`, `k`, `l` | Move left, down, up, right |
| `w` | Move word forward |
| `b` | Move word backward |
| `0` | Move to start of line |
| `$` | Move to end of line |
| `gg` | Move to first line |
| `G` | Move to last line |
| `Ctrl+U` | Page up |
| `Ctrl+D` | Page down |
| `i` | Insert mode (before cursor) |
| `a` | Insert mode (after cursor) |
| `I` | Insert at start of line |
| `A` | Insert at end of line |
| `o` | Open new line below |
| `O` | Open new line above |
| `x` | Delete character under cursor |
| `X` | Delete character before cursor |
| `dd` | Delete current line |
| `yy` | Copy (yank) current line |
| `p` | Paste after cursor |
| `>` | Indent line |
| `<` | Unindent line |
| `/` | Search forward |
| `n` | Next search result |
| `N` | Previous search result |
| `?` | Show quick help |
| `Ctrl+B` | Toggle sidebar |
| `Ctrl+N` | Next buffer |
| `Ctrl+P` | Previous buffer |
| `Ctrl+Q` | Quit |

#### Command Mode (`:`)

| Command | Action |
|---------|--------|
| `:w` | Save file |
| `:w filename` | Save as |
| `:q` | Quit |
| `:q!` | Quit without saving |
| `:wq` | Save and quit |
| `:e filename` | Open file |
| `:n` | New file |
| `:bn` | Next buffer |
| `:bp` | Previous buffer |
| `:bd` | Close buffer |
| `:set nu` | Show line numbers |
| `:set nonu` | Hide line numbers |
| `:set ai` | Enable auto-indent |
| `:set noai` | Disable auto-indent |
| `:syntax on` | Enable syntax highlighting |
| `:syntax off` | Disable syntax highlighting |
| `:help` | Show help |

#### Insert Mode

| Key | Action |
|-----|--------|
| `Esc` | Return to normal mode |
| `Ctrl+C` | Return to normal mode |
| `Tab` | Insert spaces |
| `Backspace` | Delete previous character |
| `Delete` | Delete character under cursor |
| Arrow keys | Move cursor |

## Syntax Highlighting

The editor provides syntax highlighting for:

- **Keywords**: `set`, `~s`, `ret`, `~r`, `em`, `~e`, `text`, `link`, etc.
- **Special Variables**: `@si`, `@ui`, `@yui`, `@pop`, etc.
- **Strings**: `"Hello World"`
- **Numbers**: `42`, `3.14`
- **Comments**: `// This is a comment`
- **Operators**: `+`, `-`, `*`, `/`, `=`, etc.

## Configuration

The editor can be configured through command-line options and in-editor commands:

```bash
# Enable line numbers by default
droy-editor --line-numbers myfile.droy

# Disable syntax highlighting
droy-editor --no-syntax myfile.droy
```

## Building from Source

```bash
# Standard build
make

# Debug build with symbols
make debug

# Clean build artifacts
make clean

# Run static analysis
make analyze

# Format source code
make format

# Create distribution package
make dist
```

## Project Structure

```
c-editor/
├── include/
│   └── droy_editor.h      # Header file with all declarations
├── src/
│   ├── main.c              # Entry point
│   ├── droy_editor.c       # Core editor functionality
│   ├── editor_display.c    # Screen rendering
│   ├── editor_input.c      # Input handling
│   ├── editor_cursor.c     # Cursor movement
│   ├── editor_edit.c       # Text editing operations
│   ├── editor_search.c     # Search and replace
│   └── editor_file.c       # File operations
├── obj/                    # Object files (generated)
├── bin/                    # Executable (generated)
├── Makefile                # Build configuration
└── README.md               # This file
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](../LICENSE) file for details.

## Acknowledgments

- Built with [ncurses](https://invisible-island.net/ncurses/) for terminal handling
- Inspired by Vim and Emacs
- Created for the Droy Programming Language

## Support

If you encounter any issues or have questions:

1. Check the [Issues](https://github.com/droy-go/droy-lang/issues) page
2. Create a new issue with details about your problem
3. Join our community discussions

---

**Happy Coding with Droy!** ◈
