# Changelog

All notable changes to the Droy Programming Language will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Initial release of Droy Programming Language
- Complete lexer and parser
- Tree-walking interpreter
- Package manager with basic commands
- 50+ built-in functions
- Module system with import/export
- REPL (Read-Eval-Print Loop)

## [2.0.0] - 2024-01-XX

### Added
- New language syntax with shorthand operators (~s, ~r, ~e)
- Special variables (@si, @ui, @yui, @pop, @abc, @argc, @argv, @env)
- Link system for external connections
- Style (sty) blocks for UI styling
- Package declaration (pkg)
- Block and key definitions
- Class and struct support
- Interface definitions
- Enum types
- Enhanced control flow (fe/else, for, while, break, continue)
- Function definitions with closures
- Array and object literals
- Member and index access
- Binary and unary operators
- Assignment operators (+=, -=, *=, /=)

### Package Manager
- `droy init` - Initialize new packages
- `droy install` - Install packages from registry/GitHub
- `droy uninstall` - Remove packages
- `droy update` - Update packages
- `droy search` - Search package registry
- `droy publish` - Publish packages
- `droy list` - List installed packages
- `droy info` - Show package information
- `droy clean` - Clean cache

### Built-in Functions
- I/O: print, println, input
- Type: type, len
- Array: push, pop, shift, unshift, slice
- String: split, join, replace, contains, index_of
- Math: random, floor, ceil, round, abs, sqrt, pow, min, max, range
- File: read_file, write_file, append_file, delete_file, exists
- Directory: mkdir, rmdir, list_dir, chdir, getcwd
- System: getenv, setenv, exec, exit, sleep, time
- Network: fetch, encode_url, decode_url
- Utility: to_string, to_number, parse_json, stringify_json, uuid

---

## Release Notes Template

```markdown
## [X.Y.Z] - YYYY-MM-DD

### Added
- New features

### Changed
- Changes in existing functionality

### Deprecated
- Soon-to-be removed features

### Removed
- Now removed features

### Fixed
- Bug fixes

### Security
- Security improvements
```
